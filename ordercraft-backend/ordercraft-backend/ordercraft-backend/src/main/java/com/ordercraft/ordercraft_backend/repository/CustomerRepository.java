package com.ordercraft.ordercraft_backend.repository;

import com.ordercraft.ordercraft_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}