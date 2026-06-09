package fa.training.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import fa.training.model.RefreshToken;
import fa.training.model.User;


public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByRfToken(String token);

    List<RefreshToken> findByUser(User user);
}
