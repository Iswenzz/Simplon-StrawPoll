<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Home page controller.
 * @package App\Controller
 */
class HomeController extends AbstractController
{
	/**
	 * Serve the react application.
	 * @Route("/")
	 */
    public function index()
    {
        return $this->render("index.html");
    }
}
