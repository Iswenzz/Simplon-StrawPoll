<?php

namespace App\Repository;

use App\Entity\PollUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PollUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method PollUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method PollUser[]    findAll()
 * @method PollUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PollUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PollUser::class);
    }

    // /**
    //  * @return PollUser[] Returns an array of PollUser objects
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
    public function findOneBySomeField($value): ?PollUser
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
