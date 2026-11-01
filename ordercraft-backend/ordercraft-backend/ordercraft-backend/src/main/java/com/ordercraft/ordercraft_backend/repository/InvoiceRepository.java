package com.ordercraft.ordercraft_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ordercraft.ordercraft_backend.entity.Invoice;

public interface InvoiceRepository
        extends JpaRepository<Invoice, Long> {
}