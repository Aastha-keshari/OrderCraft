package com.ordercraft.ordercraft_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ordercraft.ordercraft_backend.entity.ManufacturingOrder;

public interface ManufacturingOrderRepository
        extends JpaRepository<ManufacturingOrder, Long> {
}