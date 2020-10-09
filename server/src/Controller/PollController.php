<?php

namespace App\Controller;

use App\Entity\Poll;
use App\Entity\PollEntry;
use App\Entity\PollUser;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Poll API Controller.
 * @package App\Controller
 * @Route("/api/poll", name="poll")
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

			// serialize Poll object to JSON
			$classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
			$serializer = new Serializer([new ObjectNormalizer($classMetadataFactory)], [new JsonEncoder()]);
			$pollJson = json_decode($serializer->serialize($poll, "json", [
				"groups" => ["poll"]
			]));
			return $this->json(["success" => true, "poll" => $pollJson]);
		}
        return $this->json(["success" => false,
			"error" => "Error during the creation of the poll!"]);
    }

	/**
	 * Get a Poll from its id.
	 * @Route("/{id}")
	 * @param int $id - The poll ID.
	 * @param Request $req
	 * @return JsonResponse
	 */
	public function getPoll(int $id, Request $req)
	{
		$classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
		$serializer = new Serializer([new ObjectNormalizer($classMetadataFactory)], [new JsonEncoder()]);
		$myIp = $req->getClientIp();

		if (isset($myIp))
		{
			/**
			 * serialize Poll object to JSON
			 * @var Poll $poll
			 */
			$poll = $this->getDoctrine()->getRepository(Poll::class)->find($id);
			$json = json_decode($serializer->serialize($poll, "json", [
				"groups" => ["poll"]
			]), true);

			// check if the user already voted
			$users = $poll->getUsers()->toArray();
			$foundUsers = array_filter($users, function(PollUser $u) use ($myIp)
			{
				return $myIp === $u->getIp();
			});

			$json["isVoted"] = count($foundUsers) > 0;
			return $this->json(["success" => true, "poll" => $json]);
		}
		return $this->json(["success" => false]);
    }

	/**
	 * Vote a Poll from its id and entry index.
	 * @Route("/{id}/{entryIndex}")
	 * @param int $id - The poll ID.
	 * @param int $entryIndex - The poll vote entry index.
	 * @param Request $req
	 * @param ValidatorInterface $validator
	 * @return JsonResponse
	 */
    public function votePoll(int $id, int $entryIndex, Request $req, ValidatorInterface $validator)
	{
		$entityManager = $this->getDoctrine()->getManager();
		$myIp = $req->getClientIp();

		if (isset($myIp))
		{
			/**
			 * @var Poll $poll
			 * @var PollEntry $pollEntry
			 */
			$poll = $this->getDoctrine()->getRepository(Poll::class)->find($id);
			$users = $poll->getUsers()->toArray();

			$foundUsers = array_filter($users, function(PollUser $u) use ($myIp)
			{
				return $myIp === $u->getIp();
			});
			// user already voted
			if (count($foundUsers))
				return $this->json(["success" => false, "error" => "You already voted this poll!"]);

			// create new user on this poll
			$user = new PollUser();
			$user->setIp($myIp);
			$user->setPoll($poll);

			// validate user
			$errors = $validator->validate($user);
			if (count($errors))
				return $this->json(["success" => false, "error" => $errors->get(0)->getMessage()]);
			$entityManager->persist($user);

			// update poll entry vote
			$pollEntry = $poll->getEntries()->get($entryIndex);
			$pollEntry->setVoteCount($pollEntry->getVoteCount() + 1);
			$entityManager->persist($pollEntry);
			$entityManager->flush();

			// serialize Poll object to JSON
			$classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
			$serializer = new Serializer([new ObjectNormalizer($classMetadataFactory)], [new JsonEncoder()]);
			$pollJson = json_decode($serializer->serialize($poll, "json", [
				"groups" => ["poll"]
			]));
			return $this->json(["success" => true, "poll" => $pollJson]);
		}
		return $this->json(["success" => false]);
	}
}
