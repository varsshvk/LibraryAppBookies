package com.example.Project.LibraryApp.Mapper;

import com.example.Project.LibraryApp.dto.BookDTO;
import com.example.Project.LibraryApp.entity.Book;

//BookMapper.java
public class BookMapper {
 public static BookDTO toDTO(Book entity) {
     if (entity == null) return null;
     BookDTO dto = new BookDTO();
     dto.setBid(entity.getBid());
     dto.setTitle(entity.getTitle());
     dto.setAuthor(entity.getAuthor());
     dto.setGenre(entity.getGenre());
     dto.setPublisher(entity.getPublisher());
     dto.setIsbn(entity.getIsbn());
     dto.setLanguage(entity.getLanguage());
     dto.setEdition(entity.getEdition());
     dto.setDescription(entity.getDescription());
     dto.setNumberOfPages(entity.getNumberOfPages());
     dto.setCost(entity.getCost());
     dto.setAvailability(entity.getAvailability() != null ? entity.getAvailability().toString() : null);
     dto.setCategoryName(entity.getCategory() != null ? entity.getCategory().getName() : null);
     return dto;
 }
}
