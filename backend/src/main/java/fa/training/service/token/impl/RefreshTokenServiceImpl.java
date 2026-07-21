package fa.training.service.token.impl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import fa.training.exception.TokenRefreshException;
import fa.training.model.RefreshToken;
import fa.training.model.User;
import fa.training.repository.RefreshTokenRepository;
import fa.training.repository.UserRepository;
import fa.training.security.jwt.JwtProvider;
import fa.training.service.token.RefreshTokenSerice;
import jakarta.transaction.Transactional;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenSerice {

    @Value("${jwt.app.jwt.refresh.expiration.ms}")
    private Long refreshTokenDurationMs;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByRfToken(token);
    }

    @Override
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId).get();
        List<RefreshToken> rfToken = refreshTokenRepository.findByUser(user);
        if (rfToken.size() > 0) {
            System.out.println(rfToken.get(0).getRfToken());
            refreshTokenRepository.delete(rfToken.get(0));
        }
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setRfToken(UUID.randomUUID().toString());
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    @Transactional
    @Override
    public int deleteByUserId(Long userId) {
        // return refreshTokenRepository.deleteByUser(userId);
        return 7;
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) throws TokenRefreshException {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getRfToken(),
                    "Refresh token was expired.");
        }
        return token;
    }

    @Autowired
    JwtProvider jwtProvider;

    @Override
    public String refreshToken(String rfToken) throws TokenRefreshException {
        RefreshToken refreshToken = findByToken(rfToken).orElse(null);

        try {
            verifyExpiration(refreshToken);
        } catch (TokenRefreshException ex) {
            throw new TokenRefreshException(rfToken, "Token not found");
        }catch(NullPointerException ex){
            throw new TokenRefreshException(rfToken, "Token not found");
        }

        String token = jwtProvider.generateTokenFromUser(refreshToken.getUser());
        return token;
    }

}
