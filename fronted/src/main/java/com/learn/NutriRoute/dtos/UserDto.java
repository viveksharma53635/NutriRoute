package com.learn.NutriRoute.dtos;

import com.learn.NutriRoute.entities.Role;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

   
    private String id;

   
    private String fullName;

    private String email;

    private String password;

    private Integer age;

    // NEW FIELDS

    private String gender;

    private Double weightKg;

    private Double heightCm;

    private String profession;

    private String goal;

    // ROLE RELATION

    @ManyToOne
    private Role role;
}