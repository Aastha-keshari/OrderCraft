package com.ordercraft.ordercraft_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ordercraft.ordercraft_backend.entity.PurchaseOrder;

public interface PurchaseOrderRepository
        extends JpaRepository<PurchaseOrder, Long> {
}