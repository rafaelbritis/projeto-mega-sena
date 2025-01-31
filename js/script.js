document.getElementById('consultaForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o recarregamento da página

    // Captura as dezenas inseridas pelo usuário
    const dezenas = [
        parseInt(document.getElementById('dezena1').value),
        parseInt(document.getElementById('dezena2').value),
        parseInt(document.getElementById('dezena3').value),
        parseInt(document.getElementById('dezena4').value),
        parseInt(document.getElementById('dezena5').value),
        parseInt(document.getElementById('dezena6').value)
    ];

    // Valida se todas as dezenas estão entre 1 e 60
    if (dezenas.some(dezena => isNaN(dezena) || dezena < 1 || dezena > 60)) {
        alert("Por favor, insira dezenas válidas (números entre 1 e 60).");
        return;
    }

    // Carrega o arquivo CSV
    fetch('data/mega_sena.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo CSV. Verifique o caminho e o nome do arquivo.');
            }
            return response.text();
        })
        .then(csvText => {
            // Usa o PapaParse para converter o CSV em um array de objetos
            const resultados = Papa.parse(csvText, {
                header: true, // Usa a primeira linha do CSV como cabeçalho
                dynamicTyping: true // Converte os valores para seus tipos corretos (números, datas, etc.)
            }).data;

            // Verifica se as dezenas já foram sorteadas
            const resultado = resultados.filter(concurso => {
                const dezenasSorteadas = [
                    concurso.Dezena1,
                    concurso.Dezena2,
                    concurso.Dezena3,
                    concurso.Dezena4,
                    concurso.Dezena5,
                    concurso.Dezena6
                ];
                return dezenas.every(dezena => dezenasSorteadas.includes(dezena));
            });

            // Exibe o resultado
            const resultadoDiv = document.getElementById('resultado');
            if (resultado.length > 0) {
                resultadoDiv.innerHTML = `<p>As dezenas já foram sorteadas nos seguintes concursos:</p>`;
                resultado.forEach(concurso => {
                    resultadoDiv.innerHTML += `<p>Concurso ${concurso.Concurso} em ${concurso.Data}</p>`;
                });
            } else {
                resultadoDiv.innerHTML = `<p>As dezenas nunca foram sorteadas.</p>`;
            }
        })
        .catch(error => {
            console.error('Erro ao carregar ou processar o CSV:', error);
            alert("Erro ao carregar os dados. Verifique o console para mais detalhes.");
        });
});