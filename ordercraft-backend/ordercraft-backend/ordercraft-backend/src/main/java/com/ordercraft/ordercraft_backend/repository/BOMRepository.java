package com.ordercraft.ordercraft_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ordercraft.ordercraft_backend.entity.BOM;

public interface BOMRepository extends JpaRepository<BOM, Long> {
}