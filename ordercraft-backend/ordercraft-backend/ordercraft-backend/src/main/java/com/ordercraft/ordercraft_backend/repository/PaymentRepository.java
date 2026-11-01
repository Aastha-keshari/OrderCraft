package com.ordercraft.ordercraft_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ordercraft.ordercraft_backend.entity.Payment;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {
}