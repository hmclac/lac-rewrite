from google.cloud import firestore
from datetime import datetime, timedelta

# Initialize Firestore client
# Replace 'your-project-id' with your actual project ID
db = firestore.Client(project='harveymuddlac')

def get_day_of_week_and_hour(day_number, time_str):
    """Convert day number to day of the week and extract hour from time string."""
    base_date = datetime(2024, 1, 1)
    target_date = base_date + timedelta(days=day_number)
    day_of_week = target_date.strftime('%A')
    year = target_date.year
    month = target_date.month

    # Parse the time string to get the hour
    time_obj = datetime.strptime(time_str, '%I:%M %p')
    hour = time_obj.hour

    return day_of_week, year, month, hour

def aggregate_swipes_by_day():
    # Query the 'swipes' collection
    swipes_ref = db.collection('swipes')
    swipes = swipes_ref.stream()

    # Initialize a dictionary to count swipes per day of the week for each month and year
    day_counts = {}

    for swipe in swipes:
        swipe_data = swipe.to_dict()
        day_number = swipe_data.get('day')

        # Calculate the day of the week, year, and month
        day_of_week, year, month, _ = get_day_of_week_and_hour(day_number, "12:00 AM")  # Time is irrelevant here

        # Initialize the year, month, and day if not already present
        if year not in day_counts:
            day_counts[year] = {}
        if month not in day_counts[year]:
            day_counts[year][month] = {day: 0 for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}

        # Increment the count for the corresponding day, month, and year
        day_counts[year][month][day_of_week] += 1

    return day_counts

def aggregate_swipes_by_hour():
    # Query the 'swipes' collection
    swipes_ref = db.collection('swipes')
    swipes = swipes_ref.stream()

    # Initialize a dictionary to count swipes per hour for each month and year
    hour_counts = {}

    for swipe in swipes:
        swipe_data = swipe.to_dict()
        day_number = swipe_data.get('day')
        time_str = swipe_data.get('time')

        # Calculate the year, month, and hour
        _, year, month, hour = get_day_of_week_and_hour(day_number, time_str)

        # Initialize the year, month, and hour if not already present
        if year not in hour_counts:
            hour_counts[year] = {}
        if month not in hour_counts[year]:
            hour_counts[year][month] = {h: 0 for h in range(24)}

        # Increment the count for the corresponding hour, month, and year
        hour_counts[year][month][hour] += 1

    return hour_counts

def calculate_averages(counts, total_days):
    averages = {}
    for year, months in counts.items():
        averages[year] = {}
        for month, data in months.items():
            # Calculate the number of non-zero swipe days
            non_zero_days = sum(1 for day in data if data[day] > 0)
            if non_zero_days > 0:
                averages[year][month] = {key: data[key] / non_zero_days for key in data}
            else:
                averages[year][month] = {key: 0 for key in data}
    return averages

if __name__ == "__main__":
    # Calculate the number of days in each month of each year up to today
    today = datetime.now()
    total_days = {}
    for year in range(2024, today.year + 1):
        total_days[year] = {}
        for month in range(1, 13):
            if year < today.year or (year == today.year and month <= today.month):
                if month == 2:
                    total_days[year][month] = 29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28
                elif month in [4, 6, 9, 11]:
                    total_days[year][month] = 30
                else:
                    total_days[year][month] = 31
                if year == today.year and month == today.month:
                    total_days[year][month] = today.day

    # Aggregate and calculate averages
    day_counts = aggregate_swipes_by_day()
    hour_counts = aggregate_swipes_by_hour()

    day_averages = calculate_averages(day_counts, {year: {month: total_days[year][month] // 7 for month in total_days[year]} for year in total_days})
    hour_averages = calculate_averages(hour_counts, total_days)

    # Print results
    for year, months in day_averages.items():
        for month, avg_counts in months.items():
            print(f"Average swipes per day of the week in {year}-{month:02}:")
            for day, avg in avg_counts.items():
                print(f"{day}: {avg:.2f}")
            print()

    for year, months in hour_averages.items():
        for month, avg_counts in months.items():
            print(f"Average swipes per hour in {year}-{month:02}:")
            for hour, avg in avg_counts.items():
                print(f"{hour}:00 - {avg:.2f}")
            print()
