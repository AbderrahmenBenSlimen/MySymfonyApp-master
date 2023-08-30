<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\LoginFormAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function createUser(EntityManagerInterface $entityManager, Request $request, UserPasswordHasherInterface $passwordHasher): RedirectResponse
    {

        $submittedToken = $request->request->get('_csrf_token');

        // 'delete-item' is the same value used in the template to generate the token
        if ($this->isCsrfTokenValid('register', $submittedToken)) {
            $user = new User();
            $user->setName($request->get('name'));
            $user->setLastname($request->get('lastname'));
            $user->setEmail($request->get('email'));
            $attributes = $user->getAttributes();
            $attributes['activated'] =  (new \DateTime())->format('m/d/Y');
            $attributes['deleted'] =  null;
            $user->setAttributes($attributes);
            $user->setRoles(["ROLE_Utilisateur"]);
            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $request->get('password')
            );
            $user->setPassword($hashedPassword);

            $entityManager->persist($user);

            // actually executes the queries (i.e. the INSERT query)
            $entityManager->flush();

            return $this->redirectToRoute('app_login');
        }
        else{
            throw new \Exception("Invalid CSRF token"); 
        }
    }
    #[Route('/register/mailcheck/{email}', name: 'app_register_mailcheck')]
    public function mailCheck(EntityManagerInterface $entityManager, string $email, Request $request): Response
    {

        
        $user = $entityManager->getRepository(User::class)->findOneByEmail($email);
        if($user){
            return new Response("Exist");
        }
        
        return new Response("Not Exist");

    }

}
