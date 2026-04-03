package com.learn.NutriRoute.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.learn.NutriRoute.entities.User;
import com.learn.NutriRoute.enums.AppRole;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    @Query("""
            select u
            from User u
            join fetch u.role
            where u.email = :email
            """)
    Optional<User> findWithRoleByEmail(String email);

    @EntityGraph(attributePaths = "role")
    Optional<User> findWithRoleById(String id);

    @EntityGraph(attributePaths = "role")
    @Query("select u from User u")
    List<User> findAllWithRole();

    List<User> findByFullName(String fullName);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = "role")
    List<User> findByRoleRoleName(AppRole roleName);
}
