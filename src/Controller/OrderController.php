<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderDetails;
use App\Entity\Provider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\Length;

class OrderController extends AbstractController
{
    #[Route('/order', name: 'order_index')]
    public function index(EntityManagerInterface $entityManager, Request $request, PaginatorInterface $paginator): Response
    {
        $repository = $entityManager->getRepository(Order::class);
        $orders = $repository->findAll();

        $pagination = $paginator->paginate(
            $orders,
            $request->query->get('page', 1), // set the current page
            5 // set the number of orders per page
        );
        return $this->render('order/index.html.twig', [
            'pagination' => $pagination,
        ]);
    }

    #[Route('/order/create', name: 'order_create')]
    public function create(EntityManagerInterface $entityManager, Request $request, PaginatorInterface $paginator): Response
    {

        return $this->render('order/create.html.twig');
    }
    #[Route('/order/{id}/show', name: 'order_show')]
    public function show(EntityManagerInterface $entityManager, int $id): Response
    {
        $order = $entityManager->getRepository(Order::class)->find($id);


        return $this->render('order/details.html.twig', [
            'order' => $order,
        ]);
    }



    #[Route('/order/store', name: 'order_store')]
    public function store(EntityManagerInterface $entityManager, Request $request, PaginatorInterface $paginator): Response
    {
        $data = $request->request->all();

        if (isset($data['provider_' . 1]))
            $providers = array($data['provider_' . 1]);

        for ($i = 1; $i <= 5; $i++) {
            if (isset($data['provider_' . $i], $data['product_' . $i], $data['quantity_' . $i], $data['total_' . $i])) {
                for ($j = $i + 1; $j <= 5; $j++) {
                    if (isset($data['provider_' . $j])) {
                        if (!in_array($data['provider_' . $j], $providers)) {
                            array_push($providers, $data['provider_' . $j]);
                        }
                    }
                }
            }
        }
        $order = new Order();
        $total = 0;
        for ($i = 0; $i < count($providers); $i++) {

            $provider = $entityManager->getRepository(Provider::class)->find($providers[$i]);
            $products = $provider->getproduct()->toArray();

            for ($j = 1; $j <= 5; $j++) {
                if (isset($data['provider_' . $j], $data['product_' . $j], $data['quantity_' . $j], $data['total_' . $j]) && $providers[$i] === $data['provider_' . $j]) {


                    foreach ($products as $product) {
                        if ($product->getName() === $data['product_' . $j]) {
                            $orderDetails = new OrderDetails();
                            $orderDetails->setOrderId($order);
                            $orderDetails->setProduct($product);
                            $orderDetails->setQuantity($data['quantity_' . $j]);
                            $orderDetails->setUnitPrice($product->getUnitPrice());
                            $total = $total + $product->getUnitPrice() * $data['quantity_' . $j];
                            $entityManager->persist($orderDetails);
                        }
                    }
                }
            }
        }

        $order->setDate(new \DateTime());
        $order->setTotal($total);
        $entityManager->persist($order);
        $entityManager->flush();

        return $this->redirectToRoute('order_index');

            /*  $provider = $entityManager->getRepository(Provider::class)->find($data['provider_' . $i]);
                $order = new Order();

                $order->setProvider($provider->getName());
                $order->setProduct($data['product_' . $i]);
                $order->setQuantity($data['quantity_' . $i]);
                $order->setTotal($data['total_' . $i]);

                $entityManager->persist($order);
                $insertedIds[] = $order->getId(); */;
        /*  for ($i = 1; $i <= 5; $i++) {
            if (isset($data['provider_' . $i], $data['product_' . $i], $data['quantity_' . $i], $data['total_' . $i])) {
                $provider = $entityManager->getRepository(Provider::class)->find($data['provider_' . $i]);
                $order = new Order();

                $order->setProvider($provider->getName());
                $order->setProduct($data['product_' . $i]);
                $order->setQuantity($data['quantity_' . $i]);
                $order->setTotal($data['total_' . $i]);

                $entityManager->persist($order);
                $insertedIds[] = $order->getId();
            }
        } 
        $entityManager->flush();
        $identityMap = $entityManager->getUnitOfWork()->getIdentityMap()[Order::class];


        $lastOrders = [];
        foreach ($identityMap as $order) {
            $lastOrders[] = $order;
        }

        $orders = [];
        foreach ($lastOrders as $order) {
            $orders[] = [
                'provider' => $order->getProvider(),
                'product' => $order->getProduct(),
                'quantity' => $order->getQuantity(),
                'total' => $order->getTotal(),
            ];
        }

        $response = new JsonResponse($orders);*/
    }
}
