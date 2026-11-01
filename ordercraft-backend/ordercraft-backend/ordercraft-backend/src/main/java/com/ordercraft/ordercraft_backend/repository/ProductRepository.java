package com.ordercraft.ordercraft_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ordercraft.ordercraft_backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}