package com.learn.NutriRoute.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.learn.NutriRoute.entities.Role;
import com.learn.NutriRoute.enums.AppRole;
import com.learn.NutriRoute.repository.RoleRepository;

@Configuration
public class RoleDataInitializer {

    @Bean
    CommandLineRunner seedRoles(RoleRepository roleRepository) {
        return args -> {
            ensureRole(roleRepository, AppRole.ROLE_USER);
            ensureRole(roleRepository, AppRole.ROLE_ADMIN);
            ensureRole(roleRepository, AppRole.ROLE_COACH);
        };
    }

    private void ensureRole(RoleRepository roleRepository, AppRole appRole) {
        roleRepository.findByRoleName(appRole).orElseGet(() -> {
            Role role = new Role();
            role.setRoleName(appRole);
            return roleRepository.save(role);
        });
    }
}
