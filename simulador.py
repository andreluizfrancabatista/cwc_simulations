import pandas as pd
import numpy as np
from math import exp
from collections import defaultdict
from tqdm import tqdm
import matplotlib.pyplot as plt

# -----------------------------
def sigmoid_model(score_home, score_away):
    diff = score_home - score_away
    return 1 / (1 + exp(-diff))

# -----------------------------
def simular_fase(jogos_df, score_dict):
    vencedores = []
    for _, row in jogos_df.iterrows():
        home, away = row["HOME"], row["AWAY"]
        score_home = score_dict.get(home, 0)
        score_away = score_dict.get(away, 0)
        prob_home = sigmoid_model(score_home, score_away)
        vencedor = home if np.random.rand() < prob_home else away
        vencedores.append(vencedor)
    return vencedores

# -----------------------------
def gerar_semi_finais(vencedores_quartas):
    sf1 = {"HOME": vencedores_quartas[0], "AWAY": vencedores_quartas[3]}
    sf2 = {"HOME": vencedores_quartas[1], "AWAY": vencedores_quartas[2]}
    return pd.DataFrame([sf1, sf2])

# -----------------------------
def gerar_final(vencedores_semi):
    return pd.DataFrame([{"HOME": vencedores_semi[0], "AWAY": vencedores_semi[1]}])

# -----------------------------
def simular_torneio_monte_carlo(df_quartas, N=10000):
    if len(df_quartas) != 4 or not all(m in df_quartas["MATCH"].values for m in [1, 2, 3, 4]):
        raise ValueError("O DataFrame deve conter exatamente 4 partidas com MATCH numerado de 1 a 4.")

    score_dict = {}
    for _, row in df_quartas.iterrows():
        score_dict[row["HOME"]] = row["HOME_SCORE"]
        score_dict[row["AWAY"]] = row["AWAY_SCORE"]

    contagem = defaultdict(lambda: {"semifinal": 0, "final": 0, "vencedor": 0})

    for _ in tqdm(range(N), desc="Simulando torneios"):
        df_quartas_ord = df_quartas.sort_values("MATCH").reset_index(drop=True)
        vencedores_quartas = simular_fase(df_quartas_ord, score_dict)

        for time in vencedores_quartas:
            contagem[time]["semifinal"] += 1

        df_semi = gerar_semi_finais(vencedores_quartas)
        vencedores_semi = simular_fase(df_semi, score_dict)

        for time in vencedores_semi:
            contagem[time]["final"] += 1

        df_final = gerar_final(vencedores_semi)
        campeao = simular_fase(df_final, score_dict)[0]
        contagem[campeao]["vencedor"] += 1

    times = sorted(set(df_quartas["HOME"]).union(set(df_quartas["AWAY"])))
    resultado = pd.DataFrame([
        {
            "Time": time,
            "Quartas-final": 100.0,
            "Semifinal": round(100 * contagem[time]["semifinal"] / N, 2),
            "Final": round(100 * contagem[time]["final"] / N, 2),
            "Vencedor": round(100 * contagem[time]["vencedor"] / N, 2),
        }
        for time in times
    ])

    resultado = resultado.sort_values("Vencedor", ascending=False).reset_index(drop=True)
    
    # Exportar para CSV
    resultado.to_csv("data/resultados_monte_carlo.csv", index=False, sep=";")
    print("\n📁 Arquivo 'resultados_monte_carlo.csv' salvo com sucesso!")

    return resultado

# -----------------------------
if __name__ == "__main__":
    df = pd.read_csv("data/WORLD-CWC-scores.csv", sep=";")
    N = 10000
    resultado = simular_torneio_monte_carlo(df, N)

    print(f"\n📊 Resultado da Simulação Monte Carlo ({N} execuções):\n")
    print(resultado.to_string(index=False))