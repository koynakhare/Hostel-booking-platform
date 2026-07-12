package com.hostel_booking_platform.hostel_booking_platform.config;

import com.hostel_booking_platform.hostel_booking_platform.security.JwtAuthFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/uploads/hostels/**");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
		public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
				http
								.cors(cors -> {})
								.csrf(csrf -> csrf.disable())
								.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
								.authorizeHttpRequests(auth -> auth
												.requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
												.requestMatchers("/api/payments/config").permitAll()
												.requestMatchers("/uploads/hostels/**").permitAll()
												// .requestMatchers("/api/hostels/**").permitAll()
												.anyRequest().authenticated())
												.exceptionHandling(ex -> ex
													.authenticationEntryPoint((request, response, authException) -> {
															response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
															response.setContentType("application/json");
															response.getWriter().write(
																			"{\"timestamp\":\"" + java.time.LocalDateTime.now() + "\"," +
																			"\"status\":401," +
																			"\"error\":\"Unauthorized\"," +
																			"\"message\":\"Authentication required. Please provide a valid token.\"}"
															);
													})
									) 
								.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
		
				return http.build();
		}
}