
package com.ordercraft.ordercraft_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = {
    "http://localhost:4200",
    "http://localhost:60004"
})
public class OrdercraftBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrdercraftBackendApplication.class, args);
    }
}
