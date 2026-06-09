package fa.training.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import fa.training.model.Role;
import fa.training.security.jwt.JwtAuthorizationFilter;
import fa.training.service.impl.UserDetailService;

/**
 * SecurityConfig class configures Spring Security settings for the application.
 * It includes authentication provider, password encoder, JWT authorization
 * filter,
 * and security filter chain configurations.
 * CORS (Cross-Origin Resource Sharing) is also configured to allow requests
 * from any origin.
 * 
 * @author KhangNV19
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    UserDetailService userDetailService;

    /**
     * Configures the DaoAuthenticationProvider with the userDetailsService and
     * passwordEncoder.
     * 
     * @return Configured DaoAuthenticationProvider.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    /**
     * Configures the AuthenticationManager with the provided
     * AuthenticationConfiguration.
     * 
     * @param authConfig AuthenticationConfiguration provided by Spring Security.
     * @return Configured AuthenticationManager.
     * @throws Exception If an exception occurs during configuration.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {

        return authConfig.getAuthenticationManager();
    }

    /**
     * Configures the BCryptPasswordEncoder as the password encoder.
     * 
     * @return BCryptPasswordEncoder.
     */
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the JwtAuthorizationFilter for JWT token authorization.
     * 
     * @return Configured JwtAuthorizationFilter.
     */
    @Bean
    public JwtAuthorizationFilter jwtAuthorizationFilter() {

        return new JwtAuthorizationFilter();
    }

    /**
     * Configures CORS for allowing requests from specific origin.
     * 
     * @return WebMvcConfigurer for CORS configuration.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedOrigins("*")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
                ;
            }
        };
    }

    /**
     * Configures the SecurityFilterChain for handling HTTP security settings.
     * 
     * @param http HttpSecurity instance to be configured.
     * @return Configured SecurityFilterChain.
     * @throws Exception If an exception occurs during configuration.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()
                        .requestMatchers("/**").permitAll()
                        .requestMatchers("/docs/**").permitAll()
                        .requestMatchers("/api/v1/user/**").hasRole(Role.ADMIN.name())
                        .anyRequest()
                        .authenticated());

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(jwtAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
