package com.learn.NutriRoute.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.learn.NutriRoute.entities.Role;
import java.util.List;
import java.util.Optional;

import com.learn.NutriRoute.enums.AppRole;


public interface RoleRepository extends JpaRepository<Role, Integer> {
	
	Optional<Role> findByRoleName(AppRole roleName);

}
