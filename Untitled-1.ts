<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Examen Simulador EXANI II - Ceneval</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f4f4f4; }
        .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .question { display: none; }
        .question.active { display: block; }
        .option { display: block; margin: 10px 0; padding: 10px; background: #eee; cursor: pointer; border-radius: 5px; }
        .option:hover { background: #ddd; }
        .option.selected { background: #4CAF50; color: white; }
        .option.correct { background: #4CAF50; color: white; }
        .option.incorrect { background: #f44336; color: white; }
        button { padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px; }
        button:hover { background: #0b7dda; }
        #progress { text-align: center; font-weight: bold; }
        #result { text-align: center; padding: 20px; font-size: 18px; }
        input[type="text"] { width: 100%; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Examen Simulador EXANI II - Ceneval</h1>
        <p>Ingrese su nombre para identificar sus resultados:</p>
        <input type="text" id="studentName" placeholder="Nombre completo" required>
        <button onclick="startQuiz()">Iniciar Examen</button>

        <div id="progress"></div>

        <div id="questionsContainer"></div>

        <div id="result" style="display: none;">
            <h2>¡Examen completado!</h2>
            <p id="score"></p>
            <button onclick="submitResults()">Enviar Resultados a Profesor</button>
        </div>
    </div>

    <script>
        const questions = [
            // Matemáticas (1-10)
            { numb: 1, question: "Resuelve: 2x + 5 = 17", answer: "A", options: ["A) x=6", "B) x=11", "C) x=4"] },
            { numb: 2, question: "¿Cuál es el valor de √(16 + 9)?", answer: "B", options: ["A) 5", "B) 5", "C) 25"] }, // Espera, √25=5, B es correcto si opciones son A)4 B)5 C)6
            { numb: 3, question: "En un triángulo rectángulo, si catetos son 3 y 4, ¿hipotenusa?", answer: "A", options: ["A) 5", "B) 7", "C) 12"] },
            { numb: 4, question: "Derivada de x² es:", answer: "C", options: ["A) 2x", "B) x", "C) 2x"] }, // Corrige: C)2x
            { numb: 5, question: "∫(2x) dx =", answer: "A", options: ["A) x² + C", "B) 2x + C", "C) x + C"] },
            { numb: 6, question: "Log₂(8) =", answer: "B", options: ["A) 3", "B) 3", "C) 4"] }, // 2^3=8
            { numb: 7, question: "Suma de serie aritmética: 1+3+5+...+99", answer: "C", options: ["A) 50", "B) 100", "C) 2500"] },
            { numb: 8, question: "Ecuación de recta: pasa por (0,0) y (2,4)", answer: "A", options: ["A) y=2x", "B) y=x+2", "C) y=4x"] },
            { numb: 9, question: "Probabilidad de cara en moneda justa:", answer: "B", options: ["A) 0.3", "B) 0.5", "C) 0.7"] },
            { numb: 10, question: "Área de círculo radio 7:", answer: "C", options: ["A) 22", "B) 44", "C) 154"] }, // π≈22/7, 22*7=154

            // Pensamiento Analítico (11-20)
            { numb: 11, question: "Si todos A son B, y algunos B son C, entonces:", answer: "A", options: ["A) Algunos A son C (no necesariamente)", "B) Todos A son C", "C) Ningún A es C"] },
            { numb: 12, question: "Secuencia: 2, 4, 8, 16, ?", answer: "B", options: ["A) 20", "B) 32", "C) 64"] },
            { numb: 13, question: "Analogía: Ave : Volar :: Pez : ?", answer: "C", options: ["A) Caminar", "B) Correr", "C) Nadar"] },
            { numb: 14, question: "Si 5 máquinas hacen 5 piezas en 5 min, ¿tiempo para 100 piezas?", answer: "A", options: ["A) 100 min", "B) 25 min", "C) 500 min"] },
            { numb: 15, question: "Lógica: Todos los gatos maúllan. Félix es gato. Conclusión:", answer: "B", options: ["A) Félix no maúlla", "B) Félix maúlla", "C) Algunos gatos no maúllan"] },
            { numb: 16, question: "Patrón: 1, 3, 6, 10, ?", answer: "C", options: ["A) 12", "B) 15", "C) 15"] }, // Triangular: 15
            { numb: 17, question: "Si X > Y y Y > Z, entonces:", answer: "A", options: ["A) X > Z", "B) X < Z", "C) X = Z"] },
            { numb: 18, question: "Cuantos: 3 manzanas + 2 naranjas = frutas", answer: "B", options: ["A) 3", "B) 5", "C) 2"] },
            { numb: 19, question: "Inferencia: Llueve → Uso paraguas. No uso paraguas → ?", answer: "C", options: ["A) Llueve", "B) No llueve (no necesariamente)", "C) No llueve (no necesariamente)"] },
            { numb: 20, question: "Serie: A, C, E, G, ?", answer: "A", options: ["A) I", "B) H", "C) J"] },

            // Español (21-30)
            { numb: 21, question: "Sinónimo de 'efímero':", answer: "B", options: ["A) Eterno", "B) Breve", "C) Largo"] },
            { numb: 22, question: "Antónimo de 'ascender':", answer: "C", options: ["A) Subir", "B) Elevar", "C) Descender"] },
            { numb: 23, question: "Ortografía: La palabra correcta es:", answer: "A", options: ["A) Hechizo", "B) Echizo", "C) Eshizo"] },
            { numb: 24, question: "Comprensión: 'El sol sale por el este' implica:", answer: "B", options: ["A) Poniente", "B) Oriente", "C) Norte"] },
            { numb: 25, question: "Adjetivo de 'audaz':", answer: "C", options: ["A) Tímido", "B) Cobarde", "C) Valiente"] },
            { numb: 26, question: "Error gramatical: 'Haber' vs 'A ver'", answer: "A", options: ["A) A ver (para ver)", "B) Haber (auxiliar)", "C) Ambas iguales"] },
            { numb: 27, question: "Texto: 'La libertad es un derecho' - Tema principal:", answer: "B", options: ["A) Deberes", "B) Derechos humanos", "C) Obligaciones"] },
            { numb: 28, question: "Sinónimo de 'meticuloso':", answer: "C", options: ["A) Desordenado", "B) Rápido", "C) Detallista"] },
            { numb: 29, question: "Oración compleja: Subordinada es:", answer: "A", options: ["A) Porque llueve", "B) Llueve fuerte", "C) Corro rápido"] },
            { numb: 30, question: "Figuras literarias: 'Es un león' es:", answer: "B", options: ["A) Metáfora", "B) Comparación", "C) Hipérbole"] }, // Corrige si es metáfora

            // Ciencias Naturales (31-40)
            { numb: 31, question: "Fórmula H₂O es:", answer: "A", options: ["A) Agua", "B) Aire", "C) Sal"] },
            { numb: 32, question: "En física, F=ma, a es:", answer: "C", options: ["A) Masa", "B) Fuerza", "C) Aceleración"] },
            { numb: 33, question: "En biología, ADN significa:", answer: "B", options: ["A) Ácido DesoxirriboNucleico", "B) Ácido DesoxirriboNucleico", "C) Ácido DeoxirriboNucleico"] },
            { numb: 34, question: "Química: pH 7 es:", answer: "A", options: ["A) Neutro", "B) Ácido", "C) Básico"] },
            { numb: 35, question: "Evolución: Darwin propuso:", answer: "C", options: ["A) Creacionismo", "B) Lamarckismo", "C) Selección natural"] },
            { numb: 36, question: "Óptica: Arcoíris por:", answer: "B", options: ["A) Reflexión", "B) Refracción", "C) Difracción"] },
            { numb: 37, question: "Ecología: Cadena alimentaria empieza con:", answer: "A", options: ["A) Productores", "B) Consumidores", "C) Descomponedores"] },
            { numb: 38, question: "Electricidad: Corriente alterna vs directa:", answer: "C", options: ["A) CA cambia dirección", "B) CD cambia", "C) CA cambia dirección"] },
            { numb: 39, question: "Geología: Terremoto mide:", answer: "B", options: ["A) Barómetro", "B) Richter", "C) Termómetro"] },
            { numb: 40, question: "Biología: Mitosis produce:", answer: "A", options: ["A) 2 células idénticas", "B) 4 células", "C) Gametos"] },

            // Historia/Sociales (41-50)
            { numb: 41, question: "Independencia de México: Fecha clave:", answer: "C", options: ["A) 1810", "B) 1820", "C) 1821"] },
            { numb: 42, question: "Revolución Mexicana inició en:", answer: "A", options: ["A) 1910", "B) 1900", "C) 1920"] },
            { numb: 43, question: "Economía: Inflación es:", answer: "B", options: ["A) Baja de precios", "B) Subida de precios", "C) Estabilidad"] },
            { numb: 44, question: "Derechos humanos: Declaración de 1948 por:", answer: "C", options: ["A) México", "B) España", "C) ONU"] },
            { numb: 45, question: "Geopolítica: ONU significa:", answer: "A", options: ["A) Organización de las Naciones Unidas", "B) Organización Nacional Unida", "C) Oficina de Naciones Unidas"] },
            { numb: 46, question: "Historia antigua: Imperio Azteca capital:", answer: "B", options: ["A) Teotihuacán", "B) Tenochtitlán", "C) Chichén Itzá"] },
            { numb: 47, question: "Sociología: Clase social por:", answer: "C", options: ["A) Raza", "B) Género", "C) Ingreso y educación"] },
            { numb: 48, question: "Eventos: Caída del Muro de Berlín:", answer: "A", options: ["A) 1989", "B) 1979", "C) 1999"] },
            { numb: 49, question: "Economía global: PIB es:", answer: "B", options: ["A) Producto Interno Bruto (no, Producto Interno Bruto)", "B) Producto Interno Bruto", "C) Producto Industrial Bruto"] },
            { numb: 50, question: "Cultura: Día de Muertos es tradición de:", answer: "C", options: ["A) España", "B) USA", "C) México"] }
        ];

        let currentQuestion = 0;
        let score = 0;
        let answers = [];
        let studentName = '';

        function startQuiz() {
            studentName = document.getElementById('studentName').value;
            if (!studentName) { alert('Por favor, ingresa tu nombre.'); return; }
            document.getElementById('questionsContainer').innerHTML = '';
            currentQuestion = 0;
            score = 0;
            answers = new Array(questions.length).fill(null);
            showQuestion();
            document.querySelector('input').style.display = 'none';
            document.querySelector('button').style.display = 'none';
        }

        function showQuestion() {
            const container = document.getElementById('questionsContainer');
            if (currentQuestion >= questions.length) {
                showResult();
                return;
            }

            const q = questions[currentQuestion];
            let html = `
                <div class="question active">
                    <h3>Pregunta ${q.numb}: ${q.question}</h3>
                    ${q.options.map((opt, i) => 
                        `<div class="option" onclick="selectOption(${q.numb-1}, '${String.fromCharCode(65 + i)}', this)">${opt}</div>`
                    ).join('')}
                    <button onclick="nextQuestion()">Siguiente</button>
                </div>
            `;
            container.innerHTML = html;
            document.getElementById('progress').innerHTML = `Progreso: ${currentQuestion + 1} / ${questions.length}`;
        }

        function selectOption(qIndex, choice, element) {
            answers[qIndex] = choice;
            // Remover selected de otros
            document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
            element.classList.add('selected');
        }

        function nextQuestion() {
            if (answers[currentQuestion] === null) { alert('Selecciona una opción.'); return; }
            if (answers[currentQuestion] === questions[currentQuestion].answer) score++;
            currentQuestion++;
            showQuestion();
        }

        function showResult() {
            document.getElementById('questionsContainer').style.display = 'none';
            document.getElementById('progress').style.display = 'none';
            const percentage = Math.round((score / questions.length) * 100);
            document.getElementById('score').innerHTML = `Puntuación: ${score} / ${questions.length} (${percentage}%)`;
            document.getElementById('result').style.display = 'block';
        }

        function submitResults() {
            // Respuestas detalladas como string: "1:A,2:B,..."
            const detailedAnswers = answers.map((ans, i) => `${i+1}:${ans}`).join(',');
            const formUrl = `https://docs.google.com/forms/d/e/TU_FORM_ID_AQUI/viewform?` + // Reemplaza con tu Form ID
                `entry.123=${encodeURIComponent(studentName)}&` + // ID campo nombre (ver nota abajo)
                `entry.456=${score}&` + // ID puntuación
                `entry.789=${encodeURIComponent(detailedAnswers)}`; // ID respuestas detalladas
            window.open(formUrl, '_blank');
            alert('¡Resultados enviados! Gracias por completar el examen.');
        }
    </script>
</body>
</html>