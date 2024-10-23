import { Shield, Lock, TrendingUp } from 'lucide-react';

const features = [
  {
    name: 'Secure Escrow',
    description: 'Your funds are held safely in escrow until you confirm receipt of your purchase.',
    icon: Shield,
  },
  {
    name: 'Buyer Protection',
    description: 'Full protection against fraud with our comprehensive dispute resolution system.',
    icon: Lock,
  },
  {
    name: 'Market Analytics',
    description: 'Make informed decisions with real-time market data and pricing trends.',
    icon: TrendingUp,
  },
];

export function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Secure Trading</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for safe online trading
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform provides all the tools and security features you need to trade with confidence.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}