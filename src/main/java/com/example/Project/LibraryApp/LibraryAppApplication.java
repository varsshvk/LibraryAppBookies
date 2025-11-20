package com.example.Project.LibraryApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@SpringBootApplication
@EnableScheduling   // Enables scheduled background tasks
public class LibraryAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(LibraryAppApplication.class, args);
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "varssha123";
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println(encodedPassword);
	}

}
