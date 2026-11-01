package com.ordercraft.ordercraft_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ordercraft.ordercraft_backend.entity.BOM;
import com.ordercraft.ordercraft_backend.repository.BOMRepository;

@RestController
@RequestMapping("/api/boms")
@CrossOrigin(origins = "http://localhost:4200")
public class BOMController {

    private final BOMRepository bomRepository;

    public BOMController(BOMRepository bomRepository) {
        this.bomRepository = bomRepository;
    }

    @GetMapping
    public List<BOM> getAllBOMs() {
        return bomRepository.findAll();
    }

    @PostMapping
    public BOM addBOM(@RequestBody BOM bom) {
        return bomRepository.save(bom);
    }
}