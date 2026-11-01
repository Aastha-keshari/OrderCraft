package com.ordercraft.ordercraft_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @SequenceGenerator(
        name = "invoice_seq",
        sequenceName = "invoices_seq",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "invoice_seq"
    )
    private Long id;

    private String invoiceNumber;
    private Long customerId;
    private Long orderId;
    private Double amount;
    private String invoiceDate;
    private String status;

    public Invoice() {
    }

    public Invoice(
            String invoiceNumber,
            Long customerId,
            Long orderId,
            Double amount,
            String invoiceDate,
            String status) {

        this.invoiceNumber = invoiceNumber;
        this.customerId = customerId;
        this.orderId = orderId;
        this.amount = amount;
        this.invoiceDate = invoiceDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(String invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}