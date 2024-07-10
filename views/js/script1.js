let chartInstance1 = null;

function handleDropdownChange1() {
    const selectedValue3 = document.getElementById('term3-select').value;
    const selectedValue4 = document.getElementById('term4-select').value;
    const displayValue3 = document.getElementById('term3-select').options[document.getElementById('term3-select').selectedIndex].text;
    const displayValue4 = document.getElementById('term4-select').options[document.getElementById('term4-select').selectedIndex].text;
    sendDataToApp1(selectedValue3, selectedValue4, displayValue3, displayValue4);
}

function sendDataToApp1(selectedValue3, selectedValue4, displayValue3, displayValue4) {
    const url = `/migrationData?selectedValue3=${encodeURIComponent(selectedValue3)}&selectedValue4=${encodeURIComponent(selectedValue4)}`;

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
        console.log('Migration Data received successfully:', data);
        fetchAndUpdateChart1(selectedValue3, selectedValue4, displayValue3, displayValue4);
    })
    .catch(error => {
        console.error('Error sending migration data:', error);
    });
}

function fetchAndUpdateChart1(selectedValue3, selectedValue4, displayValue3, displayValue4) {
    fetch(`/migrationData?selectedValue3=${selectedValue3}&selectedValue4=${selectedValue4}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Updated Migration Chart Data:', data);
        createOrUpdateChart1(data, selectedValue3, selectedValue4, displayValue3, displayValue4);
    })
    .catch(error => console.error('Error fetching updated migration chart data:', error));
}

function createOrUpdateChart1(data, selectedValue3, selectedValue4, displayValue3, displayValue4) {
        console.log(selectedValue4);
    const ctx1 = document.getElementById('myChart1').getContext('2d');
    if (!ctx1) {
        console.error('Failed to get 2D context for canvas.');
        return;
    }

    const chartData1 = {
        labels: data.map(entry => entry.Period),
        datasets: [{
            data: data.map(entry => entry[selectedValue4]),
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
    calculatePercentChange1(data, selectedValue4)
    if (chartInstance1) {
        chartInstance1.data = chartData1;
        console.log(chartInstance1.data);
        chartInstance1.options.plugins.title.text = `${displayValue3} Flow Of ${displayValue4}`;
        chartInstance1.options.scales.y.title.text= `${displayValue3}`
        chartInstance1.update();
    } else {
 
        chartInstance1 = new Chart(ctx1, {
            type: 'line',
            data: chartData1,
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
                            text: displayValue3,
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
                    text: `${displayValue3} Flow Of ${displayValue4}`, // Change chart title here
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
                            borderColor: '#8d0d22',
                            borderWidth: 3,
                            label: {
                                content: 'Brexit',
                                enabled: true,
                                position: 'top'
                            }
                        }]
                    }
                },

            }
        });
    }
}

function calculatePercentChange1(data, selectedValue3) {
    // Filter data for entries in 2020 and latest year
    const data2020 = data.find(entry => entry.Period === '2020');
    const latestEntry = data[data.length - 1]; // Assuming data is sorted by date or latest entry is known
    
    if (!data2020 || !latestEntry) {
        console.error('Data for 2020 or latest entry not found.');
        return null;
    }

    // Calculate percent change based on selectedValue3
    const percentChange1 = ((latestEntry[selectedValue3] - data2020[selectedValue3]) / data2020[selectedValue3]) * 100;
        // Determine if increase or decrease
        const changeTypeElement1 = document.getElementById('changeType1');
        if (percentChange1 > 0) {
            changeTypeElement1.textContent = 'Increased';
        } else if (percentChange1 < 0) {
            changeTypeElement1.textContent = 'Decreased';
        } else {
            changeTypeElement1.textContent = 'Changed'; // Handle case where percentChange === 0 if needed
        }
    
        
    const percentChangeElement1 = document.getElementById('percentChangeValue1');
    
    if (percentChangeElement1) {
    percentChangeElement1.textContent = percentChange1.toFixed(2);
    } else {
    console.error(percentChange1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.');
    let displayValue1 = 'House Price';
    let displayValue2 = 'London';
    let displayValue3 = 'Immigration';
    let displayValue4 = 'All Nationalities';
    // Initial fetch to populate the chart with default data
    fetchAndUpdateChart('AveragePrice', 'London','House Prices', 'London');
    fetchAndUpdateChart1('Immigration', 'AllNationalities','Immigration', 'All Nationalities');
})
