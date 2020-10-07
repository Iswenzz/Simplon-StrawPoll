<?php

namespace App\Controller;

use App\Entity\Poll;
use App\Entity\PollEntry;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Poll API Controller.
 * @package App\Controller
 * @Route("/poll", name="poll")
 */
class PollController extends AbstractController
{
	/**
	 * Create a new Poll.
	 * @Route("/create")
	 * @param Request $req - The POST request.
	 * @param ValidatorInterface $validator
	 * @return JsonResponse
	 */
    public function createPoll(Request $req, ValidatorInterface $validator)
    {
		$entityManager = $this->getDoctrine()->getManager();
    	$data = json_decode($req->getContent(), true);

		$poll = new Poll();
		$poll->setQuestion($data["question"]);

		if (isset($data["question"]) && isset($data["entries"]))
		{
			foreach ($data["entries"] as $index => $entry)
			{
				$value = $entry["value"];
				if (!$value) continue;

				$pollEntry = new PollEntry();
				$pollEntry->setPoll($poll);
				$pollEntry->setValue($value);
				$pollEntry->setVoteCount(0);

				$errors = $validator->validate($pollEntry);
				if (count($errors))
					return $this->json(["success" => false, "error" => $errors->get(0)->getMessage()]);

				$poll->addEntry($pollEntry);
				$entityManager->persist($pollEntry);
			}
			$errors = $validator->validate($poll);
			if (count($errors))
				return $this->json(["success" => false, "error" => $errors->get(0)->getMessage()]);

			// persist poll
			$entityManager->persist($poll);
			$entityManager->flush();

			return $this->json(["success" => true]);
		}
        return $this->json(["success" => false,
			"error" => "Error during the creation of the poll!"]);
    }

	/**
	 * Get a Poll from its id.
	 * @Route("/{id}")
	 * @param int $id - The poll ID.
	 * @return JsonResponse
	 */
	public function getPoll(int $id)
	{
		$poll = $this->getDoctrine()->getRepository(Poll::class)->find($id);
		return $this->json($poll);
    }
}
