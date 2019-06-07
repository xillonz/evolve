# Evolution Simulation

## Description

A simulation of basic evolutionary processes using Javascript Canvas.
Agents have survival and breeding requirements. On succesful breeding, a clone is produced with each agent property having a chance of mutating by a small amount. This creates an environment in which the more succesful agents can evolve to better suit the environment.

All agent behavior is run through a neural network. Inputs are collected through sensory "organs", outputs are mapped to behavioral organs such as mouths for eating, or tails for locomotion. The neural network can also mutate between generations, allowing the agents to learn behavior to be more succesfull.

The network is automatically extensible, allowing generations to grow or lose organs while maintaining previous generations learned behavior.

The organ system follows a clear OOP approach, allowing easy creation of new mutatable organs with specialised behavior. The genetic algorithm that wraps the system naturally includes additional organ behavior. This makes it very easy to create complex creatures with complex behavior. 

All agents follow the same rules, evolved behavior such as predation, and fight/flight is all organic. 
