package com.example.Project.LibraryApp.jwt;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;

@Component
public class JwtTokenProvider {

	@Value("${app.jwt-secret}")
    private String jwtSecret;
 
    @Value("${app.jwt-expiration-milliseconds}")
    private long jwtExpirationDate;
 
    // generate JWT token
    public String generateToken(Authentication authentication){
 
        String username = authentication.getName();
 
        Date currentDate = new Date();
 
        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);
 
     // Extract authorities (roles) as List<String>
        List<String> roles = authentication.getAuthorities()
                .stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toList());

        // Add roles as custom claim
        String token = Jwts.builder()
                .setSubject(username)
                .claim("roles", roles) 
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key())
                .compact();
        return token;
    }
 
    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }
 
    // get username from JWT token
    public String getUsername(String token){
 
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
 
    // validate JWT token
    public boolean validateToken(String token){
        Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parse(token);
        return true;
 
    }
    
}