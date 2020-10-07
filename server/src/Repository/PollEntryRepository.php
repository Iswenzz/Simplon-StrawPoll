<?php

namespace App\Repository;

use App\Entity\PollEntry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PollEntry|null find($id, $lockMode = null, $lockVersion = null)
 * @method PollEntry|null findOneBy(array $criteria, array $orderBy = null)
 * @method PollEntry[]    findAll()
 * @method PollEntry[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PollEntryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PollEntry::class);
    }
}
