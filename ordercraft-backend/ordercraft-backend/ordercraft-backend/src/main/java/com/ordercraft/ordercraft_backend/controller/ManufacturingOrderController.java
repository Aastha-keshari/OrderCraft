package com.ordercraft.ordercraft_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ordercraft.ordercraft_backend.entity.ManufacturingOrder;
import com.ordercraft.ordercraft_backend.repository.ManufacturingOrderRepository;

@RestController
@RequestMapping("/api/manufacturing-orders")
@CrossOrigin(origins = "http://localhost:4200")
public class ManufacturingOrderController {

    private final ManufacturingOrderRepository manufacturingOrderRepository;

    public ManufacturingOrderController(
            ManufacturingOrderRepository manufacturingOrderRepository) {
        this.manufacturingOrderRepository = manufacturingOrderRepository;
    }

    @GetMapping
    public List<ManufacturingOrder> getAllOrders() {
        return manufacturingOrderRepository.findAll();
    }

    @PostMapping
    public ManufacturingOrder addOrder(
            @RequestBody ManufacturingOrder order) {
        return manufacturingOrderRepository.save(order);
    }
}
