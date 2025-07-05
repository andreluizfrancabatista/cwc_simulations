import pandas as pd
import numpy as np
from math import exp

# -----------------------------
# Modelo 1: Sigmoide
def sigmoid_model(score_home, score_away):
    diff = score_home - score_away
    prob_home = 1 / (1 + exp(-diff))
    prob_away = 1 - prob_home
    return prob_home, prob_away

# -----------------------------
# Modelo 2: Poisson (sem empates)
def poisson_model(score_home, score_away, N=10000):
    base = 1.5
    alpha = 0.8
    beta = 0.6
    lam_home = max(0.1, base + alpha * score_home - beta * score_away)
    lam_away = max(0.1, base + alpha * score_away - beta * score_home)
    home_wins = 0
    for _ in range(N):
        g_home = np.random.poisson(lam_home)
        g_away = np.random.poisson(lam_away)
        # Desempate forçado
        while g_home == g_away:
            g_home += np.random.binomial(1, 0.5)
            g_away += np.random.binomial(1, 0.5)
        if g_home > g_away:
            home_wins += 1
    prob_home = home_wins / N
    prob_away = 1 - prob_home
    return prob_home, prob_away

# -----------------------------
# Modelo 3: Heurístico
def heuristic_model(score_home, score_away):
    total = abs(score_home) + abs(score_away) + 1e-5
    p_home = 0.5 + 0.5 * (score_home / total)
    p_home = np.clip(p_home, 0, 1)
    p_away = 1 - p_home
    return p_home, p_away

# -----------------------------
# Simulação de classificação
def simular_classificacoes(df):
    required_cols = ["MATCH", "HOME", "AWAY", "HOME_SCORE", "AWAY_SCORE", "DIFF"]
    if not all(col in df.columns for col in required_cols):
        raise ValueError(f"Faltam colunas no DataFrame. Esperado: {required_cols}")

    results = []
    for _, row in df.iterrows():
        match_id = row["MATCH"]
        home, away = row["HOME"], row["AWAY"]
        score_home, score_away = row["HOME_SCORE"], row["AWAY_SCORE"]

        sig_home, sig_away = sigmoid_model(score_home, score_away)
        poi_home, poi_away = poisson_model(score_home, score_away)
        heu_home, heu_away = heuristic_model(score_home, score_away)

        results.append({
            "MATCH": match_id,
            "HOME": home,
            "AWAY": away,
            "SIG_HOME": sig_home,
            "SIG_AWAY": sig_away,
            "POI_HOME": poi_home,
            "POI_AWAY": poi_away,
            "HEU_HOME": heu_home,
            "HEU_AWAY": heu_away,
        })

    return pd.DataFrame(results).round(3)

# -----------------------------
# Execução principal
if __name__ == "__main__":
    df = pd.read_csv("data/WORLD-CWC-scores.csv", sep=';')
    resultado = simular_classificacoes(df)
    print(resultado)

    # Salvar os resultados (opcional)
    resultado.to_csv("data/WORLD-CWC-classificacoes.csv", sep=";", index=False)
