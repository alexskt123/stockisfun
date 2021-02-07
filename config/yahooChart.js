export const chartResponse = {
    'data': {
        'chart': {
            'result': [
                {
                    'timestamp': [],
                    'indicators': {
                        "quote": [
                            {
                                "close": []
                            }
                        ]
                    }
                }
            ]
        }
    }
}

export const quoteResponse = {
    'data': {
        "quoteResponse": {
            "result": [
            ],
            "error": null
        }
    }

}

export const keyStatResponse = {
    'data': {
        "quoteSummary": {
            "result": [
                {
                    "defaultKeyStatistics": {}
                }
            ],
            "error": null
        }
    }

}

export const recommendResponse = {
    'data': {
        "quoteSummary": {
            "result": [
                {
                    "recommendationTrend": {
                        "trend": []
                    }
                }
            ]

        }
    }
}
