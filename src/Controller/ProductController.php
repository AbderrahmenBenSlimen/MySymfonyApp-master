<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Provider;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    #[Route('/admin/product', name: 'product_index')]
    public function index(EntityManagerInterface $entityManager,Request $request, PaginatorInterface $paginator): Response
    {
        $repository = $entityManager->getRepository(Product::class);
        $products = $repository->findAll();
        $pagination = $paginator->paginate(
            $products,
            $request->query->get('page', 1), // set the current page
            5 // set the number of orders per page
        );
        return $this->render('product/index.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    #[Route('/admin/product/create', name: 'product_create')]
    public function create(): Response
    {
        return $this->render('product/create.html.twig', []);
    }


    #[Route('/admin/product/store', name: 'product_store')]
    public function store(EntityManagerInterface $entityManager, Request $request): Response
    {
        
        $product = new Product();
        $product->setName($request->get('product_name'));
        $provider = $request->get('provider_');
        $provider = $entityManager->getRepository(Provider::class)->find($provider);
        $product->setProvider($provider);
        $product->setUnitPrice($request->get('unit_price'));

        if ($request->get('activated')) {
            $product->setActivated(new \DateTime());
        }


        $entityManager->persist($product);
        $entityManager->flush();

        return $this->redirectToRoute('product_index');
    }


    #[Route('/admin/product/{id}/edit', name: 'product_edit')]
    public function edit(EntityManagerInterface $entityManager, int $id, Request $request): Response
    {
        $product = $entityManager->getRepository(Product::class)->find($id);

        return $this->render('product/edit.html.twig', [
            'product' => $product,
        ]);
    }


    #[Route('/admin/product/{id}/update', name: 'product_update')]
    public function update(EntityManagerInterface $entityManager, int $id, Request $request): Response
    {
        $product = $entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            throw $this->createNotFoundException(
                'No product found for id ' . $id
            );
        }

        if ($request->get('name')) {
            $product->setName($request->get('name'));
        }
        if ($request->get('provider')) {
            $provider = $request->get('provider');
            $provider = $entityManager->getRepository(Provider::class)->findOneBy(['name' => $provider]);
            $product->setProvider($provider);
        }
        if ($request->get('unit_price')) {
            $product->setUnitPrice($request->get('unit_price'));
        }

        if ($request->get('activated')) {
            $product->setActivated(new \DateTime());
        } else {
            $product->setActivated(null);
        }


        $entityManager->flush();

        return $this->redirectToRoute('product_index');
    }


    #[Route('/admin/product/{id}', name: 'product_destroy')]
    public function destroy(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->get('id');
        $product = $entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            throw $this->createNotFoundException(
                'No product found for id ' . $id
            );
        }


        $product->setDeleted(new \DateTime());
        $dateTime = (new \DateTime())->format('m/d/Y');
        $entityManager->flush();
        $response = new Response($dateTime);
        $response->headers->set('Content-Type', 'text/plain');
        return $response;
    }

    #[Route('/admin/product/{id}/status', name: 'product_status')]
    public function updateStatus(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->get('id');
        $product = $entityManager->getRepository(Product::class)->find($id);

        if (!$product) {
            throw $this->createNotFoundException(
                'No product found for id ' . $id
            );
        }

        if (!$product->getActivated()) {
            $product->setActivated(new \DateTime());
            $msg = "Activated";
        } else {
            $product->setActivated(null);
            $msg = "Unactivated";
        }
        $entityManager->flush();
        return new Response($msg);
    }

    public function getProducts($entityManager, $product, $provider)
    {
        $products = $entityManager->getRepository(Product::class)
        ->createQueryBuilder('u')
        ->where('u.name LIKE :name ')
        ->andWhere('u.provider = :provider')
        ->andWhere('u.activated IS NOT NULL')
        ->andWhere('u.deleted IS NULL')
        ->setParameter('name', $product.'%')
        ->setParameter('provider', $provider)
        ->getQuery()
        ->getResult();
        return $products;
    }

    #[Route('/admin/product/search/{query}', name: 'product_list_index')]
    public function list(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {


        $query = $request->get('query');
        $provider = $entityManager->getRepository(Provider::class)->findOneBy(['name' => $query]);
        
        if ($request->get('product')) {
            $product = $request->get('product');
            $products = $this->getProducts($entityManager,$product,$provider);
            
        } else {
            if ($request->get('products')) {
                $productss = $request->get('products');
                foreach ($productss as $product) {
                    $products = $entityManager->getRepository(Product::class)
                        ->createQueryBuilder('u')
                        ->where('u.provider = :provider')
                        ->andWhere('u.name NOT IN (:product)')
                        ->andWhere('u.activated IS NOT NULL')
                        ->andWhere('u.deleted IS NULL')
                        ->setParameter('provider', $provider)
                        ->setParameter('product', $productss)
                        ->getQuery()
                        ->getResult();
                }
            } else {
                $products = $entityManager->getRepository(Product::class)
                    ->createQueryBuilder('u')
                    ->where('u.provider = :provider')
                    ->andWhere('u.activated IS NOT NULL')
                    ->andWhere('u.deleted IS NULL')
                    ->setParameter('provider', $provider)
                    ->getQuery()
                    ->getResult();
            }

          
        }
        $productsName = array();
        foreach ($products as $product) {
            $productsName[] = ['name' => $product->getName(), 'price' => $product->getUnitPrice()];
        }
        return (new JsonResponse($productsName));
    }
}
