let chartInstance = null;

function handleDropdownChange() {
    const selectedValue1 = document.getElementById('term1-select').value;
    const selectedValue2 = document.getElementById('term2-select').value;
    const displayValue1 = document.getElementById('term1-select').options[document.getElementById('term1-select').selectedIndex].text;
    const displayValue2 = document.getElementById('term2-select').options[document.getElementById('term2-select').selectedIndex].text;
    sendDataToApp(selectedValue1, selectedValue2, displayValue1, displayValue2);
}

function sendDataToApp(selectedValue1, selectedValue2, displayValue1, displayValue2) {
    const url = `/data?selectedValue1=${encodeURIComponent(selectedValue1)}&selectedValue2=${encodeURIComponent(selectedValue2)}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received successfully:', data);
        fetchAndUpdateChart(selectedValue1, selectedValue2, displayValue1, displayValue2);
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });
}

function fetchAndUpdateChart(selectedValue1, selectedValue2, displayValue1, displayValue2) {
    fetch(`/data?selectedValue1=${selectedValue1}&selectedValue2=${selectedValue2}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Updated Chart Data:', data);
        createOrUpdateChart(data, selectedValue1, selectedValue2, displayValue1, displayValue2);
    })
    .catch(error => console.error('Error fetching updated chart data:', error));
}

function createOrUpdateChart(data, selectedValue1, selectedValue2, displayValue1, displayValue2) {

    const ctx = document.getElementById('myChart').getContext('2d');
    if (!ctx) {
        console.error('Failed to get 2D context for canvas.');
        return;
    }

    const chartData = {
        labels: data.map(entry => entry.Date1),
        datasets: [{
            data: data.map(entry => entry[selectedValue1]),
            borderColor: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 3,
            spanGaps: false,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 5,
            pointBackgroundColor: 'white',
            pointBorderColor: 'white'
        }]
    };
    calculatePercentChange(data, selectedValue1)
    if (chartInstance) {
        chartInstance.data = chartData;
        console.log(chartInstance.data);
        chartInstance.options.plugins.title.text = `${displayValue2} ${displayValue1}`;
        chartInstance.options.scales.y.title.text= `${displayValue1}`
        chartInstance.update();
    } else {
 
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'year',
                            displayFormats: {
                                year: 'yyyy'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Year',
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: displayValue1,
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                // Legend configuration
                legend: {
                    display: false,
                },
                // Title configuration
                title: {
                    display: true,
                    text: `${displayValue1} In ${displayValue2}`, // Change chart title here
                    color: 'white',
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    font:
                    {
                        size: 32,
                    }
                        },
                    annotation: {
                        annotations: [{
                            type: 'line',
                            mode: 'vertical',
                            scaleID: 'x',
                            value: '2020',
                            borderColor: '#012169',
                            borderWidth: 3,
                            label: {
                                content: 'Brexit',
                                enabled: true,
                                position: 'top'
                            }
                        }]
                    },
                    
                },

            }
        });
    }
}

function calculatePercentChange(data, selectedValue1) {
    const percentChangeElement = document.getElementById('percentChangeValue');
    const changeTypeElement = document.getElementById('changeType');

    // Filter data for entries in 2020 and latest year
    const data2020 = data.find(entry => entry.Date1 === '2020');
    const latestEntry = data[data.length - 1]; // Assuming data is sorted by date or latest entry is known
    
    if (!data2020 || !latestEntry) {
        console.error('Data for 2020 or latest entry not found.');
        return null;
    }

    // Calculate percent change based on selectedValue1
    const percentChange = ((latestEntry[selectedValue1] - data2020[selectedValue1]) / data2020[selectedValue1]) * 100;

    // Determine if increase or decrease
    if (percentChange > 0) {
        changeTypeElement.textContent = 'Increased';
    } else if (percentChange < 0) {
        changeTypeElement.textContent = 'Decreased';
    } else {
        changeTypeElement.textContent = 'Changed'; // Handle case where percentChange === 0 if needed
    }

    if (percentChangeElement) {
        percentChangeElement.textContent = percentChange.toFixed(2);
    } else {
        console.error('Percent Change element not found.');
    }
}
