import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, TrendingUp } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <div className="inline-flex space-x-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                Latest updates
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground">
                <span>Just shipped v1.0</span>
              </span>
            </div>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Secure Escrow Marketplace
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Buy and sell with confidence using our secure escrow service. Your funds are protected until you receive your purchase.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg">Start Shopping</Button>
            <Button variant="outline" size="lg">
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}