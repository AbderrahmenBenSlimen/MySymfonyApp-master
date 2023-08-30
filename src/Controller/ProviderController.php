<?php

namespace App\Controller;

use App\Entity\Provider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProviderController extends AbstractController
{
    #[Route('/admin/provider', name: 'provider_index')]
    public function index(EntityManagerInterface $entityManager): Response
    {

        $repository = $entityManager->getRepository(Provider::class);
        $providers = $repository->findAll();
        return $this->render('provider/index.html.twig', [
            'providers' => $providers,
        ]);
    }

    #[Route('/admin/provider/create', name: 'provider_create')]
    public function create(): Response
    {
        return $this->render('provider/create.html.twig', [
           
        ]);
    }


    #[Route('/admin/provider/store', name: 'provider_store')]
    public function store(EntityManagerInterface $entityManager, Request $request): Response
    {
    
        $provider = new Provider ();
        $provider->setName($request->get('provider_name'));

        if ($request->get('activated')) {
            $provider->setActivated(new \DateTime());
        }
     

        $entityManager->persist($provider);

        // actually executes the queries (i.e. the INSERT query)
        $entityManager->flush();

        return $this->redirectToRoute('provider_index');
    }
    
    #[Route('/admin/provider/{id}/edit', name: 'provider_edit')]
    public function edit(EntityManagerInterface $entityManager, int $id, Request $request): Response
    {
        $provider = $entityManager->getRepository(Provider::class)->find($id);
        /* $prods =$provider->getProduct();
        foreach($prods as $prod){
            dd($prod->getName());
        }
         */

        return $this->render('provider/edit.html.twig', [
            'provider' => $provider,
        ]);
    }


    #[Route('/admin/provider/{id}/update', name: 'provider_update')]
    public function update(EntityManagerInterface $entityManager, int $id, Request $request ): Response
    {

        $provider = $entityManager->getRepository(Provider::class)->find($id);

        if (!$provider) {
            throw $this->createNotFoundException(
                'No provider found for id ' . $id
            );
        }

        if ($request->get('name')) {
            $provider->setName($request->get('name'));
        }

        if ($request->get('activated')) {
            $provider->setActivated(new \DateTime());
        } else {
            $provider->setActivated(null);
        }


        $entityManager->flush();

        return $this->redirectToRoute('provider_index');
    }

    
    #[Route('/admin/provider/{id}', name: 'provider_destroy')]
    public function destroy(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->get('id');
        $provider = $entityManager->getRepository(Provider::class)->find($id);

        if (!$provider) {
            throw $this->createNotFoundException(
                'No Provider found for id ' . $id
            );
        }
        
        
        $provider->setDeleted(new \DateTime());
        $dateTime = (new \DateTime())->format('m/d/Y');
        $entityManager->flush();
        $response = new Response($dateTime);
        $response->headers->set('Content-Type', 'text/plain');
        return $response;
    }

    
    #[Route('/admin/provider/{id}/status', name: 'provider_status')]
    public function updateStatus(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->get('id');
        $provider = $entityManager->getRepository(Provider::class)->find($id);

        if (!$provider) {
            throw $this->createNotFoundException(
                'No provider found for id ' . $id
            );
        }
       
        if (! $provider->getActivated()) {
            $provider->setActivated(new \DateTime()); 
            $msg = "Activated";
        
        }else{
            $provider->setActivated(null);
            $msg = "Unactivated";
        }
        $entityManager->flush();
        return new Response($msg);
        
    }

    #[Route('/admin/provider/search/{query}', name: 'provider_list_index')]
    public function list(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $query = $request->get('query');
        $providers = $entityManager->getRepository(Provider::class)
            ->createQueryBuilder('u')
            ->where('u.name LIKE :name ')
            ->andWhere('u.activated IS NOT NULL')
            ->andWhere('u.deleted IS NULL')
            ->setParameter('name', $query.'%') // This will match any name that starts with the query
            ->getQuery()
                ->getResult();
        $providersName = array();
        foreach($providers as $provider){
            $providersName[] = ['name'=> $provider->getName() , 'id' => $provider->getId()];
        }
        
        return (new JsonResponse ($providersName));
        
    }
    /* #[Route('/admin/provider/check/{id}', name: 'provider_Exist')]
    public function check(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $name = $request->get('name');
        $provider = $entityManager->getRepository(Provider::class)->findOneBy(['name' => $name ]);
        $check = false;
        if ($provider) {
            $check = true;
        }
        
        $response = new JsonResponse($check);

        return $response;
    } */
}
