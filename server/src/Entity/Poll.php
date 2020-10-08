<?php

namespace App\Entity;

use App\Repository\PollRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=PollRepository::class)
 */
class Poll
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
	 * @Groups("poll")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
	 * @Assert\Length(max=255, maxMessage="The question must be less than 256 characters")
	 * @Groups("poll")
     */
    private $question;

    /**
     * @ORM\OneToMany(targetEntity=PollEntry::class, mappedBy="poll")
	 * @Assert\Count(min=1, minMessage="Please add atleast one poll entry!")
	 * @Groups("poll")
     */
    private $entries;

    /**
     * @ORM\OneToMany(targetEntity=PollUser::class, mappedBy="poll")
	 * @Groups("poll")
     */
    private $users;

    public function __construct()
    {
        $this->entries = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(string $question): self
    {
        $this->question = $question;

        return $this;
    }

    /**
     * @return Collection|PollEntry[]
     */
    public function getEntries(): Collection
    {
        return $this->entries;
    }

    public function addEntry(PollEntry $entry): self
    {
        if (!$this->entries->contains($entry)) {
            $this->entries[] = $entry;
            $entry->setPoll($this);
        }

        return $this;
    }

    public function removeEntry(PollEntry $entry): self
    {
        if ($this->entries->contains($entry)) {
            $this->entries->removeElement($entry);
            // set the owning side to null (unless already changed)
            if ($entry->getPoll() === $this) {
                $entry->setPoll(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|PollUser[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(PollUser $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setPoll($this);
        }

        return $this;
    }

    public function removeUser(PollUser $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getPoll() === $this) {
                $user->setPoll(null);
            }
        }

        return $this;
    }
}
