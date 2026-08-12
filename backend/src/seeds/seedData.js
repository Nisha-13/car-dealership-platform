const categoriesData = [
  {
    name: 'Luxury Sedans',
    slug: 'luxury-sedans',
    description: 'Executive comfort, elegant design, and high-performance engineering.',
    icon: 'Car',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'SUVs & Crossovers',
    slug: 'suvs-crossovers',
    description: 'Commanding road presence, all-terrain confidence, and spacious interior capability.',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Electric & Hybrid',
    slug: 'electric-hybrid',
    description: 'Zero emissions, instant electric acceleration, and cutting-edge automotive technology.',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Sports & Performance',
    slug: 'sports-performance',
    description: 'Track-inspired aerodynamic styling, raw horsepower, and exhilarating dynamics.',
    icon: 'Flame',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80'
  }
];

const carsData = [
  {
    title: '2024 Porsche Taycan Turbo S',
    brand: 'Porsche',
    model: 'Taycan Turbo S',
    year: 2024,
    price: 187600,
    categorySlug: 'electric-hybrid',
    mileage: 1200,
    fuelType: 'Electric',
    transmission: 'Automatic',
    engine: 'Dual Permanent Magnet Synchronous Motors',
    color: 'Frozen Blue Metallic',
    description: 'The Porsche Taycan Turbo S represents the pinnacle of electric performance. Experiencing 0-60 mph in 2.6 seconds with over-boost power up to 750 hp, this 800-volt architectural masterpiece seamlessly blends Porsche heritage with future mobility.',
    features: ['Launch Control', 'Porsche Active Suspension Management (PASM)', 'Burmester 3D Surround Sound', 'Night Vision Assist', 'Head-Up Display', '16.8-inch Curved Gauge Cluster', 'Panoramic Glass Roof'],
    status: 'Available',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: {
      horsepower: '750 HP',
      acceleration: '0-60 mph in 2.6s',
      topSpeed: '162 mph',
      drivetrain: 'All-Wheel Drive (AWD)',
      seatingCapacity: 4,
      doors: 4,
      warranty: '4 Years / 50,000 Miles'
    }
  },
  {
    title: '2024 BMW M5 Competition',
    brand: 'BMW',
    model: 'M5 Competition',
    year: 2024,
    price: 112900,
    categorySlug: 'sports-performance',
    mileage: 3500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '4.4L BMW M TwinPower Turbo V8',
    color: 'Isle of Man Green',
    description: 'An executive sedan with super sports car performance. Equipped with M xDrive intelligently biased to rear-wheel drive mode, carbon-ceramic brakes, and 617 twin-turbocharged horsepower.',
    features: ['M Carbon Ceramic Brakes', 'M Setup Customization', 'Harman Kardon Sound', 'Adaptive M Suspension Professional', 'Carbon Fiber Roof', 'Wireless Apple CarPlay & Android Auto'],
    status: 'Available',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: {
      horsepower: '617 HP',
      acceleration: '0-60 mph in 3.1s',
      topSpeed: '190 mph',
      drivetrain: 'M xDrive AWD',
      seatingCapacity: 5,
      doors: 4,
      warranty: '4 Years / 50,000 Miles'
    }
  },
  {
    title: '2024 Mercedes-AMG GT 63 S 4-Door Coupe',
    brand: 'Mercedes-Benz',
    model: 'AMG GT 63 S',
    year: 2024,
    price: 161900,
    categorySlug: 'luxury-sedans',
    mileage: 2800,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: 'Handcrafted AMG 4.0L V8 Biturbo',
    color: 'Designo Graphite Grey Magno',
    description: 'Combining racetrack performance with everyday luxury. The AMG GT 63 S features 630 hp, AMG RIDE CONTROL+ suspension, AMG DYNAMICS agility control, and plush Nappa leather seating.',
    features: ['AMG Track Pace', 'Burmester High-End 3D Surround Sound', 'Nappa Leather Performance Seats', 'AMG Aerodynamics Package', 'Soft-close doors'],
    status: 'Available',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: {
      horsepower: '630 HP',
      acceleration: '0-60 mph in 3.1s',
      topSpeed: '196 mph',
      drivetrain: 'AMG Performance 4MATIC+',
      seatingCapacity: 4,
      doors: 4,
      warranty: '4 Years / 50,000 Miles'
    }
  },
  {
    title: '2024 Audi RS Q8 Performance',
    brand: 'Audi',
    model: 'RS Q8',
    year: 2024,
    price: 125800,
    categorySlug: 'suvs-crossovers',
    mileage: 4100,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '4.0L Twin-Turbocharged V8 MHEV',
    color: 'Nardo Grey',
    description: 'The pinnacle of Audi Sport SUV engineering. Delivering 591 hp through quattro permanent all-wheel drive, active roll stabilization, and standard ceramic brakes.',
    features: ['RS Sport Adaptive Air Suspension', 'Audi Virtual Cockpit Plus', 'Bang & Olufsen 3D Advanced Sound', 'Massaging Front Seats', 'All-Wheel Steering'],
    status: 'Available',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: {
      horsepower: '591 HP',
      acceleration: '0-60 mph in 3.7s',
      topSpeed: '190 mph',
      drivetrain: 'quattro AWD',
      seatingCapacity: 5,
      doors: 5,
      warranty: '4 Years / 50,000 Miles'
    }
  },
  {
    title: '2024 Tesla Model S Plaid',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    price: 89990,
    categorySlug: 'electric-hybrid',
    mileage: 800,
    fuelType: 'Electric',
    transmission: 'Automatic',
    engine: 'Tri-Motor All-Wheel Drive',
    color: 'Ultra Red',
    description: 'Beyond fast. With 1,020 horsepower and torque vectoring, the Model S Plaid launches from 0 to 60 mph in under 2 seconds while maintaining a 359-mile EPA estimated range.',
    features: ['Full Self-Driving Capability', 'Yoke Steering Wheel', '22-Speaker 960W Audio System', 'Tri-Zone Climate Control', 'Gaming Computer with 10 Teraflops'],
    status: 'Available',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: {
      horsepower: '1,020 HP',
      acceleration: '0-60 mph in 1.99s',
      topSpeed: '200 mph',
      drivetrain: 'Tri-Motor AWD',
      seatingCapacity: 5,
      doors: 4,
      warranty: '4 Years / 50,000 Miles'
    }
  },
  {
    title: '2024 Range Rover SV Autobiography',
    brand: 'Land Rover',
    model: 'Range Rover SV',
    year: 2024,
    price: 234000,
    categorySlug: 'suvs-crossovers',
    mileage: 1500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '4.4L Twin-Turbocharged V8',
    color: 'Batumi Gold Satin',
    description: 'An unmatched expression of Range Rover luxury and personalization. Crafted with ceramic controls, executive seat console with deployable club table, and integrated refrigerator.',
    features: ['Executive Class Comfort Plus Rear Seats', 'Meridian Signature Sound System 1600W', '24-Way Heated & Cooled Massage Seats', 'Active Noise Cancellation'],
    status: 'Available',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: {
      horsepower: '606 HP',
      acceleration: '0-60 mph in 4.4s',
      topSpeed: '162 mph',
      drivetrain: 'All-Wheel Drive',
      seatingCapacity: 4,
      doors: 5,
      warranty: '4 Years / 50,000 Miles'
    }
  },
  {
    title: '2024 Ferrari F8 Tributo',
    brand: 'Ferrari',
    model: 'F8 Tributo',
    year: 2024,
    price: 325000,
    categorySlug: 'sports-performance',
    mileage: 950,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '3.9L Twin-Turbo V8',
    color: 'Rosso Corsa',
    description: 'The Ferrari F8 Tributo is the mid-rear engine sports car that represents the highest expression of the Prancing Horse’s classic two-seater berlinetta.',
    features: ['Ferrari Dynamic Enhancer Plus (FDE+)', 'Side Slip Angle Control 6.1', 'Carbon Fiber Steering Wheel with LED Shift Lights', 'Titanium Exhaust Pipes'],
    status: 'Reserved',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: {
      horsepower: '710 HP',
      acceleration: '0-60 mph in 2.9s',
      topSpeed: '211 mph',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      seatingCapacity: 2,
      doors: 2,
      warranty: '3 Years Unlimited Mileage'
    }
  },
  {
    title: '2024 Lexus LC 500 Bespoke Edition',
    brand: 'Lexus',
    model: 'LC 500',
    year: 2024,
    price: 104500,
    categorySlug: 'luxury-sedans',
    mileage: 1800,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '5.0L Naturally Aspirated V8',
    color: 'Infrared',
    description: 'A grand tourer in its purest form. Powered by a glorious 5.0-liter naturally aspirated V8 paired with a 10-speed Direct-Shift transmission and stunning concept car aesthetics.',
    features: ['Mark Levinson 13-Speaker Reference Sound', 'Carbon Fiber Roof', 'Sport Package with Torsen LSD', 'Yamaha Performance Damper'],
    status: 'Available',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    specifications: {
      horsepower: '471 HP',
      acceleration: '0-60 mph in 4.4s',
      topSpeed: '168 mph',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      seatingCapacity: 4,
      doors: 2,
      warranty: '4 Years / 50,000 Miles'
    }
  }
];

module.exports = { categoriesData, carsData };
