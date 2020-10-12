<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

/**
 * PollPage page controller.
 * @package App\Controller
 */
class HomeController extends AbstractController
{
	/**
	 * Serve the react application.
	 * @Route("/{reactRouting}", name="index", defaults={"reactRouting":null}, requirements={"reactRouting": "^(?!api).+"})
	 */
    public function index()
    {
        return $this->render("index.html");
    }
}
