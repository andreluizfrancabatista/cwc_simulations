// Mapeamento dos nomes dos times
const teamMapping = {
    'Fluminense br': {
        displayName: 'Fluminense',
        country: 'Brasil',
        logo: 'escudos/Fluminense.png',
        fallbackPaths: ['./escudos/Fluminense.png', '/escudos/Fluminense.png']
    },
    'sa Al-Hilal': {
        displayName: 'Al Hilal',
        country: 'Arábia Saudita',
        logo: 'escudos/Hilal.png',
        fallbackPaths: ['./escudos/Hilal.png', '/escudos/Hilal.png']
    },
    'Paris S-G fr': {
        displayName: 'PSG',
        country: 'França',
        logo: 'escudos/PSG.png',
        fallbackPaths: ['./escudos/PSG.png', '/escudos/PSG.png']
    },
    'de Bayern Munich': {
        displayName: 'Bayern München',
        country: 'Alemanha',
        logo: 'escudos/Bayern.png',
        fallbackPaths: ['./escudos/Bayern.png', '/escudos/Bayern.png']
    },
    'Real Madrid es': {
        displayName: 'Real Madrid',
        country: 'Espanha',
        logo: 'escudos/Real.png',
        fallbackPaths: ['./escudos/Real.png', '/escudos/Real.png']
    },
    'de Dortmund': {
        displayName: 'Borussia Dortmund',
        country: 'Alemanha',
        logo: 'escudos/Dortmund.png',
        fallbackPaths: ['./escudos/Dortmund.png', '/escudos/Dortmund.png']
    },
    'Palmeiras br': {
        displayName: 'Palmeiras',
        country: 'Brasil',
        logo: 'escudos/Palmeiras.png',
        fallbackPaths: ['./escudos/Palmeiras.png', '/escudos/Palmeiras.png']
    },
    'eng Chelsea': {
        displayName: 'Chelsea',
        country: 'Inglaterra',
        logo: 'escudos/Chelsea.png',
        fallbackPaths: ['./escudos/Chelsea.png', '/escudos/Chelsea.png']
    }
};

// Função para tentar carregar imagem com fallbacks
function createImageWithFallback(teamInfo, teamName) {
    const img = document.createElement('img');
    img.alt = teamInfo.displayName;
    
    let currentPathIndex = 0;
    const allPaths = [teamInfo.logo, ...teamInfo.fallbackPaths];
    
    function tryNextPath() {
        if (currentPathIndex < allPaths.length) {
            img.src = allPaths[currentPathIndex];
            currentPathIndex++;
        } else {
            // Se todos os caminhos falharam, usa emoji
            img.style.display = 'none';
            img.parentNode.innerHTML = getTeamEmoji(teamName);
            console.log(`Não foi possível carregar escudo para ${teamInfo.displayName}`);
        }
    }
    
    img.onerror = tryNextPath;
    img.onload = function() {
        console.log(`Escudo carregado com sucesso: ${teamInfo.displayName} - ${img.src}`);
    };
    
    // Inicia tentativa de carregamento
    tryNextPath();
    
    return img;
}

// Função para obter emoji baseado no time
function getTeamEmoji(teamName) {
    const emojiMap = {
        'Fluminense br': '🇧🇷',
        'sa Al-Hilal': '🇸🇦', 
        'Paris S-G fr': '🇫🇷',
        'de Bayern Munich': '🇩🇪',
        'Real Madrid es': '🇪🇸',
        'de Dortmund': '🇩🇪',
        'Palmeiras br': '🇧🇷',
        'eng Chelsea': '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
    };
    return emojiMap[teamName] || '⚽';
}

// Função para determinar a classe CSS baseada no valor e coluna
function getPercentageClass(value, column) {
    let baseClass = '';
    
    if (column === 'Quartas-final') baseClass = 'quarter-finals';
    else if (column === 'Semifinal') {
        if (value >= 70) baseClass = 'semi-finals-high';
        else if (value >= 40) baseClass = 'semi-finals-medium';
        else baseClass = 'semi-finals-low';
    }
    else if (column === 'Final') {
        if (value >= 40) baseClass = 'final-high';
        else if (value >= 20) baseClass = 'final-medium';
        else baseClass = 'final-low';
    }
    else if (column === 'Vencedor') {
        if (value >= 20) baseClass = 'winner-high';
        else if (value >= 10) baseClass = 'winner-medium';
        else baseClass = 'winner-low';
    }
    
    // Adiciona classe de cor baseada no valor
    const textColorClass = value >= 70 ? 'text-light' : 'text-dark';
    return `${baseClass} ${textColorClass}`;
}

// Função para carregar dados do CSV (simulação - você pode substituir por fetch real)
function loadCSVData() {
    // Dados do CSV
    const csvData = `Time;Quartas-final;Semifinal;Final;Vencedor
de Bayern Munich;100.0;95.3;58.13;32.27
eng Chelsea;100.0;72.44;44.16;24.26
Fluminense br;100.0;66.16;33.97;16.81
de Dortmund;100.0;66.39;30.57;15.69
sa Al-Hilal;100.0;33.84;11.72;3.94
Real Madrid es;100.0;33.61;10.95;3.86
Palmeiras br;100.0;27.56;10.15;3.14
Paris S-G fr;100.0;4.7;0.35;0.03`;

    // Parse dos dados
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(';');
    const data = lines.slice(1).map(line => {
        const values = line.split(';');
        return {
            Time: values[0],
            'Quartas-final': parseFloat(values[1]),
            'Semifinal': parseFloat(values[2]),
            'Final': parseFloat(values[3]),
            'Vencedor': parseFloat(values[4])
        };
    });

    return data;
}

// Função para renderizar a tabela
function renderTable() {
    const data = loadCSVData();
    
    // Ordena por probabilidade de vencer (do maior para o menor)
    data.sort((a, b) => b.Vencedor - a.Vencedor);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpa a tabela
    
    data.forEach((team, index) => {
        const row = document.createElement('tr');
        row.className = 'team-row';
        
        const teamInfo = teamMapping[team.Time];
        
        row.innerHTML = `
            <td class="position-cell">
                <div class="position-number">${index + 1}</div>
            </td>
            <td class="logo-cell">
                <div class="team-logo" id="logo-sim-${index}">
                    ${getTeamEmoji(team.Time)}
                </div>
            </td>
            <td class="team-cell">
                <div class="team-name">
                    <div class="team-display-name">${teamInfo.displayName}</div>
                    <div class="team-country">${teamInfo.country}</div>
                </div>
            </td>
            <td class="percentage-cell">
                <div class="percentage-bar ${getPercentageClass(team['Quartas-final'], 'Quartas-final')}">
                    ${team['Quartas-final'].toFixed(0)}%
                </div>
            </td>
            <td class="percentage-cell">
                <div class="percentage-bar ${getPercentageClass(team.Semifinal, 'Semifinal')}">
                    ${team.Semifinal.toFixed(1)}%
                </div>
            </td>
            <td class="percentage-cell">
                <div class="percentage-bar ${getPercentageClass(team.Final, 'Final')}">
                    ${team.Final.toFixed(1)}%
                </div>
            </td>
            <td class="percentage-cell">
                <div class="percentage-bar ${getPercentageClass(team.Vencedor, 'Vencedor')}">
                    ${team.Vencedor.toFixed(1)}%
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
        
        // Tenta carregar a imagem após adicionar à DOM
        const logoContainer = document.getElementById(`logo-sim-${index}`);
        const img = createImageWithFallback(teamInfo, team.Time);
        
        // Se a imagem carregar, substitui o emoji
        img.onload = function() {
            logoContainer.innerHTML = '';
            logoContainer.appendChild(img);
        };
    });
}

// Função alternativa para carregar dados de arquivo real
async function loadRealCSVData() {
    try {
        const response = await fetch('../data/resultados_monte_carlo.csv');
        const csvText = await response.text();
        
        // Parse do CSV
        const lines = csvText.trim().split('\n');
        const data = lines.slice(1).map(line => {
            const values = line.split(';');
            return {
                Time: values[0],
                'Quartas-final': parseFloat(values[1]),
                'Semifinal': parseFloat(values[2]),
                'Final': parseFloat(values[3]),
                'Vencedor': parseFloat(values[4])
            };
        });
        
        return data;
    } catch (error) {
        console.log('Erro ao carregar CSV real, usando dados simulados:', error);
        return loadCSVData();
    }
}

// Função para renderizar tabela com dados reais
async function renderTableWithRealData() {
    const data = await loadRealCSVData();
    
    // Ordena por probabilidade de vencer (do maior para o menor)
    data.sort((a, b) => b.Vencedor - a.Vencedor);

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Limpa a tabela
    
    data.forEach((team, index) => {
        const row = document.createElement('tr');
        row.className = 'team-row';
        
        const teamInfo = teamMapping[team.Time];
        
        if (teamInfo) {
            row.innerHTML = `
                <td class="position-cell">
                    <div class="position-number">${index + 1}</div>
                </td>
                <td class="logo-cell">
                    <div class="team-logo" id="logo-${index}">
                        ${getTeamEmoji(team.Time)}
                    </div>
                </td>
                <td class="team-cell">
                    <div class="team-name">
                        <div class="team-display-name">${teamInfo.displayName}</div>
                        <div class="team-country">${teamInfo.country}</div>
                    </div>
                </td>
                <td class="percentage-cell">
                    <div class="percentage-bar ${getPercentageClass(team['Quartas-final'], 'Quartas-final')}">
                        ${team['Quartas-final'].toFixed(0)}%
                    </div>
                </td>
                <td class="percentage-cell">
                    <div class="percentage-bar ${getPercentageClass(team.Semifinal, 'Semifinal')}">
                        ${team.Semifinal.toFixed(1)}%
                    </div>
                </td>
                <td class="percentage-cell">
                    <div class="percentage-bar ${getPercentageClass(team.Final, 'Final')}">
                        ${team.Final.toFixed(1)}%
                    </div>
                </td>
                <td class="percentage-cell">
                    <div class="percentage-bar ${getPercentageClass(team.Vencedor, 'Vencedor')}">
                        ${team.Vencedor.toFixed(1)}%
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
            
            // Tenta carregar a imagem após adicionar à DOM
            const logoContainer = document.getElementById(`logo-${index}`);
            const img = createImageWithFallback(teamInfo, team.Time);
            
            // Se a imagem carregar, substitui o emoji
            img.onload = function() {
                logoContainer.innerHTML = '';
                logoContainer.appendChild(img);
            };
        }
    });
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Tenta carregar dados reais, se não conseguir usa dados simulados
    renderTableWithRealData();
    
    // Diagnóstico de escudos
    setTimeout(checkImagePaths, 2000);
    
    // Adiciona interatividade às barras
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('percentage-bar')) {
            const percentage = e.target.textContent;
            console.log(`Probabilidade selecionada: ${percentage}`);
            // Aqui você pode adicionar mais funcionalidades
        }
    });
});

// Função de diagnóstico para verificar caminhos das imagens
function checkImagePaths() {
    console.log('=== DIAGNÓSTICO DE ESCUDOS ===');
    
    Object.entries(teamMapping).forEach(([key, team]) => {
        console.log(`\n${team.displayName}:`);
        console.log(`  Caminho principal: ${team.logo}`);
        
        // Testa se a imagem existe
        const testImg = new Image();
        testImg.onload = function() {
            console.log(`  ✅ ${team.displayName}: Escudo carregado com sucesso!`);
        };
        testImg.onerror = function() {
            console.log(`  ❌ ${team.displayName}: Falha ao carregar escudo`);
            console.log(`  Tentando caminhos alternativos...`);
            
            // Testa caminhos alternativos
            team.fallbackPaths.forEach((path, index) => {
                const altImg = new Image();
                altImg.onload = function() {
                    console.log(`  ✅ ${team.displayName}: Caminho alternativo ${index + 1} funcionou: ${path}`);
                };
                altImg.onerror = function() {
                    console.log(`  ❌ ${team.displayName}: Caminho alternativo ${index + 1} falhou: ${path}`);
                };
                altImg.src = path;
            });
        };
        testImg.src = team.logo;
    });
    
    console.log('\n=== INSTRUÇÕES ===');
    console.log('1. Verifique se a pasta "escudos" está no mesmo diretório do HTML');
    console.log('2. Verifique se os arquivos de imagem existem com os nomes corretos:');
    console.log('   - Fluminense.png, Hilal.png, PSG.png, Bayern.png');
    console.log('   - Real.png, Dortmund.png, Palmeiras.png, Chelsea.png');
    console.log('3. Abra o console do navegador (F12) para ver mensagens detalhadas');
}

// Função utilitária para exportar dados (opcional)
function exportTableData() {
    const data = loadCSVData();
    const sortedData = data.sort((a, b) => b.Vencedor - a.Vencedor);
    
    console.table(sortedData.map((team, index) => ({
        Posição: index + 1,
        Time: teamMapping[team.Time]?.displayName || team.Time,
        'Quartas-final': `${team['Quartas-final']}%`,
        'Semifinal': `${team.Semifinal}%`,
        'Final': `${team.Final}%`,
        'Vencedor': `${team.Vencedor}%`
    })));
}