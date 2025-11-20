package com.example.Project.LibraryApp.entity;

import java.time.LocalDate;


import jakarta.persistence.*;
import jakarta.validation.constraints.Max;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bid;
  
	private String title;
    private String author;
    private String isbn;
    private String publisher;
    @Max(value = 2025, message = "Published year cannot be beyond 2025")
    private LocalDate publishedDate;
    @Column(nullable = false)
    private String edition;
    private String genre;
    @Column(nullable = false)
    private String description;
    private String language;
    private Integer numberOfPages;
    private Double cost;

    public Book(Long bid) {
		super();
		this.bid = bid;
	}

    @ManyToOne
    @JoinColumn(name = "category_id",nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Availability availability;

    public enum Availability {
        AVAILABLE,
        BORROWED,
        RESERVED,
        LOST
    }

 // No-argument constructor
    public Book() {
    }

    // Getters and Setters
    public Long getBid() {
        return bid;
    }

    public void setBid(Long id) {
        this.bid = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public LocalDate getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(LocalDate publishedDate) {
        this.publishedDate = publishedDate;
    }

    public String getEdition() {
        return edition;
    }

    public void setEdition(String edition) {
        this.edition = edition;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Integer getNumberOfPages() {
        return numberOfPages;
    }

    public void setNumberOfPages(Integer numberOfPages) {
        this.numberOfPages = numberOfPages;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Availability getAvailability() {
        return availability;
    }

    public void setAvailability(Availability availability) {
        this.availability = availability;
    }
}
