package fa.training.service.token;

import java.util.Optional;

import fa.training.exception.TokenRefreshException;
import fa.training.model.RefreshToken;

/**
 * interface RefreshTokenSerice for handling refresh tokens.
 * It includes methods for creating, deleting, and refreshing tokens.
 * @author KhangNV19
 * @version 1.0
 * @since 2023-12-14
 */
public interface RefreshTokenSerice {
    public Optional<RefreshToken> findByToken(String token);
    public RefreshToken createRefreshToken(Long userId);
    public int deleteByUserId(Long userId);
    public RefreshToken verifyExpiration(RefreshToken token) throws TokenRefreshException;
    public String refreshToken(String rfToken);
}
