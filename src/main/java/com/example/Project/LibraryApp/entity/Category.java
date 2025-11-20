package com.example.Project.LibraryApp.entity;

import jakarta.persistence.*;

@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cid;
    
	private String name;
    public Category() {
		super();
		// TODO Auto-generated constructor stub
	}

	private String description;

    public Category(Long cid) {
		super();
		this.cid = cid;
	}
    // Getters and Setters
    public Long getCid() {
        return cid;
    }

    public void setCid(Long id) {
        this.cid = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
