package com.learn.NutriRoute.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.learn.NutriRoute.entities.Role;
import com.learn.NutriRoute.enums.AppRole;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByRoleName(AppRole roleName);
}
