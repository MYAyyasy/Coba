document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file first');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const content = e.target.result;
        
        try {
            // First upload and get sample data
            const uploadResponse = await fetch('https://your-vercel-app.vercel.app/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: btoa(content)
                })
            });
            
            const uploadData = await uploadResponse.json();
            displaySummary(uploadData.sample);
            
            // Then send for full analysis
            const analysisResponse = await fetch('https://your-vercel-app.vercel.app/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: uploadData.sample
                })
            });
            
            const analysisData = await analysisResponse.json();
            displayResults(analysisData);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Analysis failed');
        }
    };
    
    reader.readAsText(file);
});

function displaySummary(data) {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `
        <p>Rows: ${data.length}</p>
        <p>Columns: ${Object.keys(data[0]).length}</p>
        <table>
            <thead>
                <tr>
                    ${Object.keys(data[0]).map(col => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr>
                        ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function displayResults(results) {
    const plotsDiv = document.getElementById('plots');
    
    if (results.plots && results.plots.pairplot) {
        plotsDiv.innerHTML = `
            <h3>Pair Plot</h3>
            <img src="data:image/png;base64,${results.plots.pairplot}" alt="Pair Plot">
        `;
    }
}
