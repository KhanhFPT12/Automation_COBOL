package fa.training.security.jwt;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import fa.training.exception.TokenException;
import fa.training.model.User;
import fa.training.security.Userprincipal;
import fa.training.service.UserService;
import fa.training.util.SecurityUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtProviderImpl implements JwtProvider {

    @Value("${app.jwt.secret}")
    private String JWT_SECRET;

    @Value("${app.jwt.expiration-in.ms}")
    private Long JWT_EXPIRATION_IN_MS;

    @Override
    public String generateToken(Userprincipal auth) {
        String authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(auth.getUsername())
                .claim("roles", authorities)
                .claim("userId", auth.getId())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_IN_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    @Autowired
    UserService userService;

    @Override
    public String generateTokenFromUser(User user) {
        Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("roles", user.getRole())
                .claim("userId", user.getId())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_IN_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public Authentication getAuthentication(HttpServletRequest request) {
        Claims claims = extractClaims(request);
        if (claims == null) {
            return null;
        }
        String username = claims.getSubject();
        Long userId = claims.get("userId", Long.class);

        Set<GrantedAuthority> authorities = Arrays.stream(claims.get("roles").toString().split(","))
                .map(SecurityUtils::convertToAuthority)
                .collect(Collectors.toSet());

        UserDetails userDetails = Userprincipal.builder().username(username)
                .id(userId)
                .build();

        if (username == null) {
            return null;
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
    }

    @Override
    public Claims extractClaims(HttpServletRequest request) {
        String token = SecurityUtils.extractAuthTokenFromRequest(request);

        if (request.getCookies() != null)
            for (Cookie cookie : request.getCookies()) {
                System.out.println(request.getCookies().length);
                System.out.println(cookie.getName() + ": " + cookie.getValue());
            }

        if (token == null) {
            return null;
        }
        Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    @Override
    public boolean isTokenValid(HttpServletRequest request) throws TokenException {
        Claims claims = extractClaims(request);
        if (claims == null) {
            return false;
        }
        if (claims.getExpiration().before(new Date())) {
            throw new TokenException("TOken expired");
        }
        return true;
    }

}
