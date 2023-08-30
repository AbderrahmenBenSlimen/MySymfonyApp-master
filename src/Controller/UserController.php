<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{


    #[Route('/admin/user', name: 'user_index')]
    public function index(EntityManagerInterface $entityManager): Response
    {

        $repository = $entityManager->getRepository(User::class);
        $users = $repository->findAll();
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
            'users' => $users,
        ]);
    }


    #[Route('/admin/user/create', name: 'user_create')]
    public function create(): Response
    {
        return $this->render('user/create.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }


    #[Route('/admin/user/store', name: 'user_store')]
    public function createUser(EntityManagerInterface $entityManager, Request $request, UserPasswordHasherInterface $passwordHasher): Response
    {

        $user = new User();
        $user->setName($request->get('name'));
        $user->setLastname($request->get('lastname'));

        $user->setEmail($request->get('email'));

        $attributes = $user->getAttributes();
        if ($request->get('activated')) {
            $attributes['activated'] =  (new \DateTime())->format('m/d/Y');   
        }
        else{
            $attributes['activated'] = null;
        }
        $attributes['deleted'] =  null;
        $user->setAttributes($attributes);
        
        $user->setRoles(["ROLE_".$request->get('role')]);
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $request->get('password')
        );
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);

        // actually executes the queries (i.e. the INSERT query)
        $entityManager->flush();

        return $this->redirectToRoute('user_index');
    }


    #[Route('/admin/user/{id}', name: 'user_destroy')]
    public function destroy(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->get('id');
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            throw $this->createNotFoundException(
                'No User found for id ' . $id
            );
        }

        $attributes = $user->getAttributes();
        
        
        $dateTime = (new \DateTime())->format('m/d/Y');
        $attributes['deleted'] = $dateTime;
        $user->setAttributes($attributes);
        
        $entityManager->flush();
        $response = new Response($dateTime);
        $response->headers->set('Content-Type', 'text/plain');
        return $response;
    }



    #[Route('/admin/user/{id}/edit', name: 'user_edit')]
    public function edit(EntityManagerInterface $entityManager, int $id, Request $request): Response
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        return $this->render('user/edit.html.twig', [
            'controller_name' => 'UserController',
            'user' => $user,
        ]);
    }


    #[Route('/admin/user/{id}/update', name: 'user_update')]
    public function update(EntityManagerInterface $entityManager, int $id, Request $request, UserPasswordHasherInterface $passwordHasher): Response
    {

        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            throw $this->createNotFoundException(
                'No User found for id ' . $id
            );
        }

        if ($request->get('name')) {
            $user->setName($request->get('name'));
        }

        if ($request->get('lastname')) {
            $user->setLastname($request->get('lastname'));
        }

        if ($request->get('email')) {
            $user->setLastname($request->get('email'));
        }


        if ($request->get('role')) {
            $user->setRoles(["ROLE_".$request->get('role')]);
        }

        if ($request->get('password')) {
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $request->get('password')
            );
            $user->setPassword($hashedPassword);
        }
        $attributes = $user->getAttributes();
        if ($request->get('activated')) {
            $attributes['activated'] = (new \DateTime())->format('m/d/Y');
        } else {
            $attributes['activated'] = null;
        }

        $user->setAttributes($attributes);

        $entityManager->flush();

        return $this->redirectToRoute('user_index');
    }

    #[Route('/admin/user/{id}/status', name: 'user_status')]
    public function updateStatus(EntityManagerInterface $entityManager, Request $request): Response
    {
        $id = $request->get('id');
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            throw $this->createNotFoundException(
                'No User found for id ' . $id
            );
        }
        $attributes = $user->getAttributes();
        if (! $attributes['activated']) {
            $attributes['activated'] = (new \DateTime())->format('m/d/Y'); 
            $msg = "Activated";
        
        }else{
            $attributes['activated']= null; 
            $msg = "Unactivated";
        }
        $user->setAttributes($attributes);
        $entityManager->flush();
        return new Response($msg);
        
    }

    #[Route('/user/register', name: 'user_register')]
    public function register(): Response
    {

        
        return $this->render('authentication/authentication.html.twig', [
            'controller_name' => 'UserController',
           
        ]);
    } 
}
