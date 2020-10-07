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

    // /**
    //  * @return PollEntry[] Returns an array of PollEntry objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PollEntry
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
